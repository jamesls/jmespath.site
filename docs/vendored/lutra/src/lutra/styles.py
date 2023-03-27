"""Pygments style for use with Lutra."""

from typing import Any, Dict

from pygments.style import Style
from pygments.token import (
    Comment,
    Error,
    Generic,
    Keyword,
    Literal,
    Name,
    Number,
    Operator,
    Other,
    Punctuation,
    String,
    Text,
    Whitespace,
)

#dfe8f1
_light_colors = {
    "base00": "#f8f8f8",
    "base01": "#f0f0f1",
    "base02": "#e5e5e6",
    "base03": "#e0e1e7",
    "base04": "#696c77",
    "base05": "#383a42",
    "base06": "#202227",
    "base07": "#090a0b",
    "red": "#ca1243",
    "orange": "#d75f00",
    "yellow": "#c18401",
    "green": "#50a14f",
    "cyan": "#0184bc",
    "blue": "#4078f2",
    "purple": "#a626a4",
    "extra": "#986801",
    'grey': '#94A3B8',
}

_dark_colors = {
    # Swapped out bg color to be more purple.
    "base00": "#1a2433",
    "base01": "#1f2225",
    "base02": "#2c343a",
    "base03": "#36444f",
    "base04": "#4c6272",
    # Swapped out fg text to be brighter white.
    "base05": "#dfe8f1",
    "base06": "#c2d9eb",
    "base07": "#e4ecf4",
    "red": "#e06c75",
    "orange": "#d19a66",
    "yellow": "#e5c07b",
    "green": "#98c379",
    "cyan": "#56b6c2",
    # 	7DD3FC
    "blue": "#61afef",
    "purple": "#c678dd",
    "extra": "#be5046",
    'grey': '#94A3B8',
}


def _styles_from_colors(colors: Dict[str, str]) -> Dict[Any, str]:
    base00 = colors["base00"]  # noqa
    base01 = colors["base01"]  # noqa
    base02 = colors["base02"]  # noqa
    base03 = colors["base03"]  # noqa
    base04 = colors["base04"]
    base05 = colors["base05"]
    base06 = colors["base06"]  # noqa
    base07 = colors["base07"]  # noqa
    red = colors["red"]
    orange = colors["orange"]
    yellow = colors["yellow"]
    green = colors["green"]
    cyan = colors["cyan"]
    blue = colors["blue"]
    purple = colors["purple"]
    extra = colors["extra"]  # noqa
    grey = colors["grey"]

    return {
        Text: base05,
        Whitespace: "",
        Error: red,
        Other: "",
        Keyword: purple,
        Keyword.Constant: cyan,
        Keyword.Declaration: "",
        Keyword.Namespace: purple,
        Keyword.Pseudo: "",
        Keyword.Reserved: "",
        Keyword.Type: "",
        Name: "",
        Name.Attribute: "",
        Name.Builtin: red,
        Name.Builtin.Pseudo: purple,
        Name.Class: blue,
        Name.Constant: cyan,
        Name.Decorator: blue,
        Name.Entity: "",
        Name.Exception: red,
        Name.Function: blue,
        Name.Function.Magic: blue,
        Name.Property: "",
        Name.Label: "",
        Name.Namespace: "",
        Name.Other: "",
        Name.Tag: orange,
        Name.Variable: purple,
        Name.Variable.Class: "",
        Name.Variable.Global: "",
        Name.Variable.Instance: "",
        Name.Variable.Magic: blue,
        Literal: "",
        Literal.Date: "",
        String: blue,
        String.Affix: f"italic {blue}",
        String.Backtick: f"bold {purple}",
        String.Char: "",
        String.Delimiter: "",
        String.Doc: f"italic {blue}",
        String.Double: blue,
        String.Escape: "",
        String.Heredoc: "",
        String.Interpol: purple,
        String.Other: "",
        String.Regex: "",
        String.Single: blue,
        String.Symbol: "",
        Number: cyan,
        Number.Bin: cyan,
        Number.Float: cyan,
        Number.Hex: cyan,
        Number.Integer: cyan,
        Number.Integer.Long: cyan,
        Number.Oct: cyan,
        Operator: grey,
        Operator.Word: yellow,
        Punctuation: "",
        Comment: f"italic {base04}",
        Comment.Hashbang: "",
        Comment.Multiline: "",
        Comment.Preproc: purple,
        Comment.PreprocFile: "",
        Comment.Single: f"italic {base04}",
        Comment.Special: "",
        Generic: "",
        Generic.Deleted: "",
        Generic.Emph: "italic",
        Generic.Error: "",
        Generic.Heading: f"bold {blue}",
        Generic.Inserted: "",
        Generic.Output: base05,
        Generic.Prompt: f"bold {purple}",
        Generic.Strong: "",
        Generic.Subheading: "",
        Generic.Traceback: "",
    }


class StyloLightStyle(Style):
    """Light mode styles."""

    default_style = ""
    background_color = _light_colors["base00"]
    highlight_color = _light_colors["base03"]

    line_number_color = "inherit"
    line_number_background_color = "transparent"

    line_number_special_color = _light_colors["base01"]
    line_number_special_background_color = "transparent"

    styles = _styles_from_colors(_light_colors)


class StyloDarkStyle(Style):
    """Dark mode styles."""

    default_style = ""
    background_color = _dark_colors["base00"]
    highlight_color = _dark_colors["base03"]

    line_number_color = "inherit"
    line_number_background_color = "transparent"

    line_number_special_color = _dark_colors["base01"]
    line_number_special_background_color = "transparent"

    styles = _styles_from_colors(_dark_colors)
