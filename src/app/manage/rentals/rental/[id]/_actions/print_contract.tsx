export default function printContract(content: string) {
  let iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  var html = `
  <html dir="ltr" lang="vi">
    <head>
      <title></title>
      <link type="text/css" rel="stylesheet" href="/css/quill.core.css">
      <link type="text/css" rel="stylesheet" href="/css/quill.snow.css">
    </head>
    <body class="ql-editor" style="font-family: times new roman;" spellcheck="false">
    ${content}
    <table border="0" cellpadding="0" cellspacing="0" style="width:100%; margin-top:2rem;">
      <tbody>
        <tr>
          <td>
            <p style="text-align:center"><strong><span style="font-family:times new roman,times,serif">BÊN CHO
                  THUÊ</span></strong></p>
            <p style="text-align:center"><em><span style="font-family:times new roman,times,serif">(ký và ghi rõ họ
                  tên)</span></em></p>
          </td>
          <td>
            <p style="text-align:center"><strong><span style="font-family:times new roman,times,serif">BÊN
                  THUÊ</span></strong></p>
            <p style="text-align:center"><em><span style="font-family:times new roman,times,serif">(ký và ghi rõ họ
                  tên)</span></em></p>
          </td>
        </tr>
      </tbody>
    </table>
    </body>
  </html>
  `;

  iframe.contentDocument?.write(html);
  iframe.contentDocument?.close();
  // Call the print function on the iframe's window after the iframe is loaded
  iframe.onload = function () {
    iframe.contentWindow?.print();

    // Remove the iframe after printing
    document.body.removeChild(iframe);
  };
}
