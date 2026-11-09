"""Prepare the complete official game and apply this repository's customizations."""
from pathlib import Path, PurePosixPath
import argparse,hashlib,shutil,tempfile,zipfile,subprocess
ROOT=Path(__file__).resolve().parents[1]
DIGEST='9fce98d4ed8ed6c7d4fcb5ec42a807736e0063ea7d4cef2332540300089d5ef1'
p=argparse.ArgumentParser();p.add_argument('apk',type=Path);p.add_argument('--output',type=Path,default=ROOT/'runtime');args=p.parse_args()
with args.apk.open('rb') as f: actual=hashlib.file_digest(f,'sha256').hexdigest()
assert actual==DIGEST,'The source APK must match the official release SHA-256.'
args.output.mkdir(parents=True,exist_ok=True)
with zipfile.ZipFile(args.apk) as apk,tempfile.TemporaryDirectory(prefix='noname-') as temp:
 inner=Path(temp)/'noname.zip'
 with apk.open('assets/www/app/noname.zip') as source,inner.open('wb') as target:shutil.copyfileobj(source,target,4*1024*1024)
 with zipfile.ZipFile(inner) as game:
  candidates=[n[:-len('noname.js')] for n in game.namelist() if n=='noname.js' or n.endswith('/noname.js')]
  prefix=min(candidates,key=len)
  for entry in game.infolist():
   if not entry.filename.startswith(prefix):continue
   rel=PurePosixPath(entry.filename[len(prefix):])
   assert '..' not in rel.parts and not rel.is_absolute()
   target=args.output.joinpath(*rel.parts)
   if entry.is_dir():target.mkdir(parents=True,exist_ok=True)
   else:
    target.parent.mkdir(parents=True,exist_ok=True)
    with game.open(entry) as source,target.open('wb') as output:shutil.copyfileobj(source,output,1024*1024)
subprocess.run(['python',str(ROOT/'tools'/'apply.py'),str(args.output)],check=True)
print('Complete customized game prepared:',args.output)
