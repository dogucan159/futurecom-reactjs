import {
  create,
  createOptions,
  ViewType,
  RichEditUnit,
  DocumentFormat,
} from "devexpress-richedit";
import { Component } from "react";

export let richEditVal = "";

export class RichEditComponent extends Component {
  rich = null;
  componentDidMount() {
    const { width, height, documentBase64 } = this.props;
    console.log(documentBase64);
    if (this.rich) return;
    // the createOptions() method creates an object that contains RichEdit options initialized with default values
    const options = createOptions();

    options.bookmarks.visibility = true;
    options.bookmarks.color = "#ff0000";

    options.confirmOnLosingChanges.enabled = true;
    options.confirmOnLosingChanges.message =
      "Are you sure you want to perform the action? All unsaved document data will be lost.";

    options.fields.updateFieldsBeforePrint = true;
    options.fields.updateFieldsOnPaste = true;

    options.mailMerge.activeRecord = 2;
    options.mailMerge.viewMergedData = true;
    // options.mailMerge.dataSource = [
    //   { Name: "Indy", age: 32 },
    //   { Name: "Andy", age: 28 },
    // ];

    // events
    options.events.activeSubDocumentChanged = () => {};
    options.events.autoCorrect = () => {};
    options.events.calculateDocumentVariable = () => {};
    options.events.characterPropertiesChanged = () => {};
    options.events.contentInserted = () => {};
    options.events.contentRemoved = () => {};
    options.events.documentChanged = () => {};
    options.events.documentFormatted = () => {};
    options.events.documentLoaded = () => {};
    options.events.gotFocus = () => {};
    options.events.hyperlinkClick = () => {};
    options.events.keyDown = () => {};
    options.events.keyUp = () => {};
    options.events.paragraphPropertiesChanged = () => {};
    options.events.lostFocus = () => {};
    options.events.pointerDown = () => {};
    options.events.pointerUp = () => {};
    options.events.saving = (s, e) => {
      e.handled = true;
      console.log(e.base64);
      richEditVal = e.base64;
    };
    options.events.saved = () => {};
    options.events.selectionChanged = () => {};
    // options.events.customCommandExecuted = (s, e) => {
    //   switch (e.commandName) {
    //     case "insertEmailSignature":
    //       s.document.insertParagraph(s.document.length);
    //       s.document.insertText(s.document.length, "_________");
    //       s.document.insertParagraph(s.document.length);
    //       s.document.insertText(s.document.length, "Best regards,");
    //       s.document.insertParagraph(s.document.length);
    //       s.document.insertText(s.document.length, "John Smith");
    //       s.document.insertParagraph(s.document.length);
    //       s.document.insertText(s.document.length, "john@example.com");
    //       s.document.insertParagraph(s.document.length);
    //       s.document.insertText(s.document.length, "+1 (818) 844-0000");
    //       break;
    //   }
    // };

    options.unit = RichEditUnit.Inch;

    options.view.viewType = ViewType.PrintLayout;
    options.view.simpleViewSettings.paddings = {
      left: 15,
      top: 15,
      right: 15,
      bottom: 15,
    };
    options.exportUrl = "https://localhost:7295/api/Sample";

    options.readOnly = false;
    options.width = width;
    options.height = height;

    this.rich = create(document.getElementById("richEdit"), options);

    this.rich.openDocument(documentBase64, "DocumentName", DocumentFormat.Rtf);
  }

  render() {
    return <div id="richEdit"></div>;
  }
}
