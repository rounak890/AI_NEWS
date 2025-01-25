import os
import time
import pandas as pd
import google.generativeai as genai

def process_ai_news_articles(input_csv, output_csv, api_key,logger ,model_name="gemini-2.0-flash-exp"):
    """
    Process AI news articles to summarize content and generate virality scores using a Generative AI model.

    Parameters:
        input_csv (str): Path to the input CSV file.
        output_csv (str): Path to save the output CSV file.
        api_key (str): API key for Generative AI.
        model_name (str): Name of the model to use. Default is "gemini-2.0-flash-exp".
        template_text (str): Template text to structure the generated content.

    Returns:
        None
    """
    # Configure Generative AI
    genai.configure(api_key=api_key)

    # Set generation parameters
    generation_config = {
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 40,
        "max_output_tokens": 8192,
        "response_mime_type": "text/plain",
    }

    # Create the model and start a chat session
    model = genai.GenerativeModel(
        model_name=model_name,
        generation_config=generation_config,
    )

    chat_session = model.start_chat(history=[])

    TEMPLATE_TEXT = """
ChatGPT Tasks: Your AI Agent for the Future

Why Read This?

OpenAI has introduced "Tasks," a new feature in ChatGPT that allows you to schedule reminders and future actions, similar to traditional digital assistants like Siri or Alexa.

Why It Matters for You:

As AI agents become more prevalent, they are revolutionizing industries by automating complex tasks traditionally handled by humans. Companies like Salesforce, ServiceNow, Microsoft, and Workday are integrating AI agents to enhance recruiting, sales lead management, marketing, and IT management. These agents demonstrate significant potential for increasing efficiency and reducing labor hours, though they also pose cybersecurity risks.

Want More?

Explore the full details here : <url>
"""


    # Load the dataset
    df = pd.read_csv(input_csv)
    logger.info("Processing started")

    # Add columns for results
    df['FINAL'] = None
    df['SCORE'] = None

    # Loop through each row in the dataset
    for index, row in df.iterrows():
        title, link, content = row['title'], row['link'], row['content']

        try:
            # Summarize content using the template
            response = chat_session.send_message(
                f"read the article and summarize and transform it to given template to attract and indulge even a non AI user \n "
                f"CONTENT : {content} \n URL : {link} \n TEMPLATE : {TEMPLATE_TEXT} \n ONLY RETURN FINAL POST NOTHING ELSE"
            )
            df.at[index, 'FINAL'] = response.text

            # Generate virality score
            response2 = chat_session.send_message(
                f'Tell me its virality score out of 10 and only return score nothing else CONTENT : {response.text}'
            )
            df.at[index, 'SCORE'] = response2.text

            logger.info(f"Processed row {index} || Score: {response2.text}")

        except Exception as e:
            logger.info(f"Error processing row {index}: {e}")

        # Add delay to avoid hitting API rate limits
        time.sleep(10)

    # Save the results to a new CSV file
    df.to_csv(output_csv, index=False)
    logger.info("Processing complete.")


