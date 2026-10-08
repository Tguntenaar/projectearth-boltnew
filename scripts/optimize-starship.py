"""Convert David Leeds' CC BY 4.0 hex MMU model to a small, uncompressed GLB.
Requires: trimesh==5.1.1 fast-simplification==0.2.0 numpy
Usage: python scripts/optimize-starship.py /path/to/starship.3mf
Source pinned below; attribution: public/credits/starship.txt.
"""
import sys, zipfile, xml.etree.ElementTree as ET
from pathlib import Path
import numpy as np
import trimesh
SOURCE = 'https://raw.githubusercontent.com/leedsexplore/starship-custom-name/aeadd6f8ec3ed632952433afe5dc5d7001272086/assets/starship_print_1_200_mmu_hex.3mf'
ns = {'m': 'http://schemas.microsoft.com/3dmanufacturing/core/2015/02'}
with zipfile.ZipFile(sys.argv[1]) as archive:
    root = ET.fromstring(archive.read('3D/3dmodel.model'))
scene = trimesh.Scene()
for obj in root.findall('.//m:object', ns):
    mesh = obj.find('m:mesh', ns)
    if mesh is None: continue
    vertices = np.array([[float(v.attrib[a]) for a in ('x','y','z')] for v in mesh.findall('m:vertices/m:vertex', ns)])
    faces = np.array([[int(t.attrib[a]) for a in ('v1','v2','v3')] for t in mesh.findall('m:triangles/m:triangle', ns)])
    steel = obj.attrib['id'] == '2'
    model = trimesh.Trimesh(vertices=vertices, faces=faces)
    model = model.simplify_quadric_decimation(face_count=10000 if steel else 20000)
    # Original nose +Z, shield +X -> nose +Y, shield +Z. Proper rotation.
    model.vertices = model.vertices[:, [1,2,0]] / 260.5
    if not steel:
        # Keep the thin tile shell clear of the simplified steel surface.
        model.vertices[:, [0,2]] *= 1.045
    model.visual = trimesh.visual.TextureVisuals(material=trimesh.visual.material.PBRMaterial(
        name='Stainless steel' if steel else 'Ceramic heat shield and engines',
        baseColorFactor=[185,196,209,255] if steel else [3,4,5,255],
        metallicFactor=0.65 if steel else 0.12,
        roughnessFactor=0.32 if steel else 0.83,
    ))
    scene.add_geometry(model, node_name=obj.attrib['name'])
    print(obj.attrib['name'], len(model.faces), model.bounds)
scene.metadata.update({'source':SOURCE,'author':'David Leeds','license':'CC BY 4.0','modifications':'Simplified meshes, rotated, scaled, PBR materials'})
output=Path(__file__).resolve().parents[1]/'src/models/starship-modern.glb'
output.write_bytes(scene.export(file_type='glb'))
print(output, output.stat().st_size)
