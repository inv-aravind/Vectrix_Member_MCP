fetch('expiry.json')
  .then((response) => response.json())
  .then((data) => {
    if (Date.now() / 1000 > data.expires_at) {
      document.documentElement.innerHTML =
        '<body style="font-family:sans-serif;padding:2rem;max-width:40rem;margin:auto">' +
        '<h1>Report expired</h1>' +
        '<p>This Allure report was valid until <strong>' +
        data.expires_at_iso +
        ' UTC</strong> (24 hours from publish).</p>' +
        '<p>Run the workflow again to generate a new report.</p>' +
        '</body>';
    }
  })
  .catch(() => {});
