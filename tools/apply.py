"""Apply the customization to a complete original game directory."""
from pathlib import Path
import argparse,shutil
root=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('game',type=Path);args=p.parse_args()
assert (args.game/'noname.js').is_file(),'Provide the original game directory.'
for source in (root/'overrides').rglob('*'):
 if source.is_file():
  target=args.game/source.relative_to(root/'overrides');target.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(source,target)
print('Customization applied.')
