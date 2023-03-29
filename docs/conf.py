# -*- coding: utf-8 -*-
import sys
import os

sys.path.insert(0, os.path.abspath('.'))
extensions = ['sphinx.ext.autodoc', 'sphinx.ext.viewcode',
              'jpextension', 'sitemap']

html_theme_path = ['vendored/lutra/src']
source_suffix = '.rst'
master_doc = 'contents'

project = u'JMESPath'
copyright = u'2014-2023, James Saryerwinnie'

version = '0.2'
release = '0.2.0'
exclude_patterns = ['_build']
html_theme = "lutra"
html_title = 'JMESPath'
pygments_style = "lutra.styles.StyloDarkStyle"
# Add any paths that contain custom static files (such as style sheets) here,
# relative to this directory. They are copied after the builtin static files,
# so a file named "default.css" will overwrite the builtin "default.css".
html_static_path = ['_static']
htmlhelp_basename = 'JMESPath Documentation'
html_additional_pages = {
    "index": "landing.html",
}

