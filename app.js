document.getElementById('barcode-input').addEventListener('change', handleFile);

function handleFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        Quagga.decodeSingle({
            src: e.target.result,
            numOfWorkers: 0,
            inputStream: {
                size: 800
            },
            decoder: {
                readers: ["code_128_reader"]
            }
        }, function(result) {
            if(result && result.codeResult) {
                searchShopify(result.codeResult.code);
            } else {
                document.getElementById('result').innerText = "Barcode not detected.";
            }
        });
    };
    reader.readAsDataURL(file);
}

function searchShopify(barcode) {
    const apiKey = 'APIKEY';
    const password = 'PASSWORD';
    const shopName = 'repurposed-gallery';

    fetch(`https://${apiKey}:${password}@${shopName}.myshopify.com/admin/api/2021-01/products.json?barcode=${barcode}`)
        .then(response => response.json())
        .then(data => {
            if (data.products.length > 0) {
                const product = data.products[0];
                document.getElementById('result').innerText = `Product: ${product.title}, Price: ${product.variants[0].price}`;
            } else {
                document.getElementById('result').innerText = 'Product not found in Shopify.';
            }
        })
        .catch(error => console.error('Error:', error));
}
