from openai import OpenAI
client = OpenAI()

def prompt_image_combination(image1_path, image2_path):
    response = client.images.create_variation(
        model="dall-e-2",
        image=open(juxtapose_image_path, "rb"),
        n=1,
        size="1024x1024"
    )

    image_url = response.data[0].url