

ImageToAscii(imageUrl, { 
    size: { width: 20 }, 
    colored: false        
}, (err, converted) => {
    if (err) {
        console.error("Error:", err);
        return;
    }
    console.log(converted);
});
