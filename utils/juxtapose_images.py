from PIL import Image

def juxtapose_images(image1_path, image2_path):
    image1 = Image.open(image1_path).convert("RGB")
    image2 = Image.open(image2_path).convert("RGB")
    
    # Resize the second image to match the first image's size
    image2 = image2.resize(image1.size)

    # Create a new image with a width equal to the sum of the widths of the two images
    total_width = image1.width + image2.width
    max_height = max(image1.height, image2.height)
    new_image = Image.new("RGB", (total_width, max_height))

    # Paste the two images side by side
    new_image.paste(image1, (0, 0))
    new_image.paste(image2, (image1.width, 0))
    return new_image
