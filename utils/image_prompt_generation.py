import mimetypes
import os

import base64
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI(
    api_key=os.getenv("API_KEY")
)

def image_classification(image_path):
    with open(image_path, "rb") as file:
        image_data = base64.b64encode(file.read()).decode('utf-8')
        image_type = mimetypes.guess_type(image_path)[0]

    response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {
        "role": "user",
        "content": [
            {"type": "text", "text": "What’s in this image? Keep response concise and informative."},
            {
            "type": "image_url",
            "image_url": {"url": f"data:{image_type};base64,{image_data}"},
            },
        ],
        }
    ],
    max_tokens=300,
    )
    return response.choices[0].message.content

def image_generation_prompt(description_1, description_2):
    prompt = "Given two images with the following descriptions, generate a new image that combines elements from both descriptions. 1. {} 2. {}".format(description_1, description_2)
    return prompt

def image_generation(image_path_1, image_path_2):
    description_1 = image_classification(image_path_1)
    description_2 = image_classification(image_path_2)
    prompt = image_generation_prompt(description_1, description_2)
    response = client.images.generate(
        model="dall-e-3",
        prompt=prompt,
        n=1,
        size="1024x1024"
    )
    print(response)
    return response.data[0].url

# ImagesResponse(created=1733195716, data=[Image(b64_json=None,
# revised_prompt="Create an image which portrays elements from two different
# subjects, a Byzantine mosaic and a historical battleship. Begin with a
# traditional Byzantine mosaic groundwork depicting a figure symbolizing wisdom
# and authority but not any specific person. Instead of a halo, center a
# silhouette of a battleship encircling the figure's head. This figure holds an
# ancient scroll in one hand and the other hand is gesturing to a historical
# warship. The warship depicted is a battleship surging through the sea, with a
# noticeable superstructure and numerous artillery placements, evoking imagery
# of the early 20th-century naval warfare.",
# url='https://oaidalleapiprodscus.blob.core.windows.net/private/org-rF2nAgLpAAcXqf9Zu5ov0QiC/user-6CSc8n3A20tpJx8CU9i2YhVi/img-w6CQWjGhqEru6Qr97IH1Ygrr.png?st=2024-12-03T02%3A15%3A15Z&se=2024-12-03T04%3A15%3A15Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-12-03T00%3A07%3A20Z&ske=2024-12-04T00%3A07%3A20Z&sks=b&skv=2024-08-04&sig=mrJ5gp5oH/wvd63YHIFCaeqwp3cmIJhFvyvDvRdb2sI%3D')])

# Example usage
# image_generation("./uploads/Christ_Pantocrator_mosaic_from_Hagia_Sophia_2744_x_2900_pixels_3.1_MB.jpg", "uploads/Yamashiro_initial_trial.jpg")
