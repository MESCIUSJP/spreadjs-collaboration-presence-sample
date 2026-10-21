window.onload = () => {
  // iframeのリロード
    window.setTimeout(() => {
      const iframe1 = document.getElementById('iframe1');
      iframe1.contentWindow.location.reload();
      const iframe2 = document.getElementById('iframe2');
      iframe2.contentWindow.location.reload();
      const iframe3 = document.getElementById('iframe3');
      iframe3.contentWindow.location.reload();
    }, 500);
}