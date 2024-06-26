const sizeValues = ["8pt", "10pt", "12pt", "14pt", "18pt", "24pt", "36pt"];
const fontValues = [
  "Arial",
  "Courier New",
  "Georgia",
  "Impact",
  "Lucida Console",
  "Tahoma",
  "Times New Roman",
  "Verdana",
];
const headerValues = [false, 1, 2, 3, 4, 5];
const fontSizeOptions = {
  inputAttr: {
    "aria-label": "Font size",
  },
};
const fontFamilyOptions = {
  inputAttr: {
    "aria-label": "Font family",
  },
};
const headerOptions = {
  inputAttr: {
    "aria-label": "Font family",
  },
};

export function getHtmlEditorOptions(height) {
  return {
    height: height,
    toolbar: {
      multiline: false,
      items: [
        "undo",
        "redo",
        "separator",
        { name: "size", acceptedValues: sizeValues, options: fontSizeOptions },
        {
          name: "font",
          acceptedValues: fontValues,
          options: fontFamilyOptions,
        },
        "separator",
        "bold",
        "italic",
        "strike",
        "underline",
        "separator",
        "alignLeft",
        "alignCenter",
        "alignRight",
        "alignJustify",
        "separator",
        "orderedList",
        "bulletList",
        "separator",
        {
          name: "header",
          acceptedValues: headerValues,
          options: headerOptions,
        },
        "separator",
        "color",
        "background",
        "separator",
        "link",
        "image",
        "separator",
        "clear",
        "codeBlock",
        "blockquote",
        "separator",
        "insertTable",
        "deleteTable",
        "insertRowAbove",
        "insertRowBelow",
        "deleteRow",
        "insertColumnLeft",
        "insertColumnRight",
        "deleteColumn",
      ],
    },
  };
}
