"""Build public/index.html from src/index.html.

- Inlines src/css/*.css and src/js/*.js where src/index.html has `/* @include css/x.css */` or `// @include js/x.js`
  (in that order; the JS parts all run inside one function, so they share variables)
- Embeds the LeetCode problem list (data/problems.csv) into /*PROBLEMS*/[]
- Embeds UI translations (i18n/<lang>.json, keys = Traditional Chinese source strings) into /*I18N*/{}

Usage: python3 build.py
"""
import csv, json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
LANGS = ['zh-CN', 'en', 'ja', 'ko', 'fr', 'hi']

probs = []
with open(os.path.join(HERE, 'data', 'problems.csv'), encoding='utf-8') as f:
    for r in csv.DictReader(f):
        probs.append([int(r['id']), r['title'], r['slug'], r['difficulty']])
probs.sort()

INCLUDE = re.compile(r'^[ \t]*(?:/\*|//)[ \t]*@include[ \t]+(\S+?)[ \t]*(?:\*/)?[ \t]*\n', re.M)
used = []
def include(m):
    used.append(m.group(1))
    part = open(os.path.join(HERE, 'src', m.group(1)), encoding='utf-8').read()
    return part if part.endswith('\n') else part + '\n'
src = INCLUDE.sub(include, open(os.path.join(HERE, 'src', 'index.html'), encoding='utf-8').read())
unused = sorted({d + '/' + f for d in ('css', 'js') for f in os.listdir(os.path.join(HERE, 'src', d))} - set(used))
assert not unused, f'not @include-d in src/index.html: {unused}'
assert '/*PROBLEMS*/[]' in src and '/*I18N*/{}' in src
page = src.replace('/*PROBLEMS*/[]', json.dumps(probs, ensure_ascii=False, separators=(',', ':')))

keys = json.load(open(os.path.join(HERE, 'i18n', 'source_zh-TW.json'), encoding='utf-8'))
i18n = {}
for lang in LANGS:
    d = json.load(open(os.path.join(HERE, 'i18n', lang + '.json'), encoding='utf-8'))
    missing = [k for k in keys if k not in d]
    if missing:
        print(f'[{lang}] missing {len(missing)} keys, e.g. {missing[:3]}')
    i18n[lang] = {k: v for k, v in d.items() if k in keys and v}
page = page.replace('/*I18N*/{}', json.dumps(i18n, ensure_ascii=False, separators=(',', ':')))

body = page.replace('<meta charset="utf-8">\n', '')
cut = body.index('</style>') + len('</style>')
html = ('<!doctype html>\n<html lang="zh-Hant">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1">\n' + body[:cut] +
        '\n</head>\n<body>\n' + body[cut:] + '\n</body>\n</html>\n')
os.makedirs(os.path.join(HERE, 'public'), exist_ok=True)
open(os.path.join(HERE, 'public', 'index.html'), 'w', encoding='utf-8').write(html)
print(f'{len(probs)} problems, {len(i18n)} translations, {round(len(html) / 1024)} KB -> public/index.html')
