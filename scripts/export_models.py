"""Export a Blender scene to a mobile-conscious, self-contained GLB.

Run with Blender:
  blender --background --python export_models.py -- INPUT.blend OUTPUT.glb

This only modifies the scene in the temporary Blender process. It never saves
changes back into the source .blend file.
"""

import os
import sys

import bpy


def arguments():
    values = sys.argv[sys.argv.index("--") + 1 :]
    if len(values) != 2:
        raise SystemExit("Expected input .blend and output .glb paths")
    return values


def main():
    source, output = arguments()
    bpy.ops.wm.open_mainfile(filepath=os.path.abspath(source))
    export_current(output)


def export_current(output, selected_objects=None, excluded_objects=None):
    if selected_objects or excluded_objects:
        bpy.ops.object.select_all(action="DESELECT")
        excluded = set(excluded_objects or [])
        selected = (
            [bpy.data.objects.get(name) for name in selected_objects]
            if selected_objects
            else [obj for obj in bpy.context.scene.objects if obj.type == "MESH" and obj.name not in excluded]
        )
        selected = [obj for obj in selected if obj is not None and obj.type == "MESH" and obj.name not in excluded]
        if not selected:
            raise RuntimeError("No requested mesh objects were found")
        for obj in selected:
            obj.select_set(True)
        bpy.context.view_layer.objects.active = selected[0]

    included = selected if selected_objects else list(bpy.context.scene.objects)
    used_images = {
        node.image
        for obj in included if obj.type == "MESH"
        for material in obj.data.materials if material and material.node_tree
        for node in material.node_tree.nodes
        if node.type == "TEX_IMAGE" and node.image
    }
    missing = [
        image
        for image in used_images
        if image.source == "FILE"
        and image.packed_file is None
        and not os.path.exists(bpy.path.abspath(image.filepath))
    ]
    if missing:
        raise RuntimeError(
            "The scene references external images that Blender cannot find. "
            "Provide those image files before exporting."
        )

    # Downsample exceptionally large source maps in this process only. GLB
    # embeds the optimized copies, while the user's original .blend is untouched.
    max_side = 2048
    for image in bpy.data.images:
        if image.source not in {"FILE", "GENERATED"} or not image.has_data:
            continue
        width, height = image.size
        longest = max(width, height)
        if longest > max_side:
            ratio = max_side / longest
            image.scale(max(1, round(width * ratio)), max(1, round(height * ratio)))
            # Pack the resized pixels in this temporary Blender session so the
            # exporter embeds the optimized copy instead of rereading the full
            # resolution source file. The original image files are never saved.
            image.pack()

    os.makedirs(os.path.dirname(os.path.abspath(output)), exist_ok=True)
    available = bpy.ops.export_scene.gltf.get_rna_type().properties
    options = {
        "filepath": os.path.abspath(output),
        "export_format": "GLB",
        "export_image_format": "JPEG",
        "export_jpeg_quality": 94,
        "export_cameras": False,
        "export_lights": False,
        "export_draco_mesh_compression_enable": True,
        "export_draco_mesh_compression_level": 6,
        "export_draco_position_quantization": 14,
        "export_draco_normal_quantization": 10,
        "export_draco_texcoord_quantization": 12,
        "export_apply": True,
        "use_selection": bool(selected_objects or excluded_objects),
    }
    options = {key: value for key, value in options.items() if key in available}
    bpy.ops.export_scene.gltf(**options)

    mesh_count = sum(1 for obj in bpy.context.scene.objects if obj.type == "MESH")
    polygon_count = sum(
        len(obj.data.polygons)
        for obj in bpy.context.scene.objects
        if obj.type == "MESH"
    )
    print(
        "Exported model summary: "
        f"{mesh_count} meshes, {polygon_count} polygons, "
        f"{os.path.getsize(output)} bytes"
    )


if __name__ == "__main__":
    main()
