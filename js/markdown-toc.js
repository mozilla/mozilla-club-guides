function tableOfContentFromHTML(inHtml, inContentContainer) {
  var contentContainer = inContentContainer || "";
  var selector = contentContainer + " [id]";
  var TOCArr = [];
  var allTOCElements = inHtml.querySelectorAll(selector);

  // build table of content by looping through elements
  for (var i = 0; i < allTOCElements.length; ++i) {
    (function extractData(item) {
      var tocObj = {};

      tocObj.id = item.id;
      tocObj.text = item.innerHTML;
      tocObj.tag = item.tagName;

      TOCArr.push(tocObj);
    }(allTOCElements[i]))
  }

  return TOCArr;

}
