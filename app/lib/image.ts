export const convertImageToBase64 = async (image: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = () => {
            if (typeof reader.result === "string") {
                resolve(reader.result.split(",")[1]);
            } else {
                reject("Failed to read file as Base64");
            }
        };
        reader.onerror = () => reject("Failed to read file");
    });
};

export const compressImage = async (
    imageFile: File,
    maxWidth = 1024,
): Promise<File> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = () => {
            const img = new Image();
            img.src = reader.result as string;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const scaleFactor = maxWidth / img.width;
                canvas.width = maxWidth;
                canvas.height = img.height * scaleFactor;
                const ctx = canvas.getContext("2d");
                ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                canvas.toBlob(
                    (blob) => {
                        resolve(
                            new File([blob as Blob], imageFile.name, { type: "image/jpeg" }),
                        );
                    },
                    "image/jpeg",
                    0.9,
                ); // Quality 90%
            };
        };
    });
};
