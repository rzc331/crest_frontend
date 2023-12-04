// Define your Eleven Labs API key
const ELEVEN_LABS_API_KEY = "756b42ca3fb28561fbb89476bad089bf"; // Add your Eleven Labs API key here
const sVoiceId =
    // "vvuMFxGMSQLNWA2WeXiZ"; // me
    // "21m00Tcm4TlvDq8ikWAM"; // Rachel
    "a6xcGYVLcBwTCco7EFzD"; // Paola
    // "nv8ORNvRd6UMneXwFPbU"; // Eliza not good
    // "tq4gpWcIGlGqKbdOgeYn"; // Myra
    // "EXAVITQu4vr4xnSDxMaL"; // Bella


// Function for making a request to Eleven Labs API and playing the response
export default async function textToSpeech(text: string, voiceId: string = sVoiceId): Promise<InstanceType<typeof Audio>> {
    // Replace all occurrences of \n with a period
    text = text.replace(/\n/g, '. ');
    // Replace all occurrences of underscore with a space
    text = text.replace(/_/g, ' ');
    // Add a space between a lowercase letter followed by an uppercase letter
    text = text.replace(/([a-z])([A-Z])/g, '$1 $2');
    // Add a space between a letter followed by a digit
    text = text.replace(/([a-zA-Z])(\d)/g, '$1 $2');
    // Replace all occurrences of element abbreviations with their full names
    text = replaceAbbreviationWithFullName(text);

    console.log(JSON.stringify(text));

    // Preparing the request
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
    const headers = new Headers();
    headers.append("Accept", "audio/mpeg");
    headers.append("Content-Type", "application/json");
    headers.append("xi-api-key", ELEVEN_LABS_API_KEY);
    const data = {
        text: text,
        voice_settings: { stability: 0, similarity_boost: 0 }
    };
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    };

    // Making the request
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Reading the response as Blob
    const blob = await response.blob();

    // Creating object URL and audio element to play the sound
    const audioURL = URL.createObjectURL(blob);
    const audio = new Audio(audioURL);
    audio.play();
    return audio;
}

function replaceAbbreviationWithFullName(text: string) {
    // Define a mapping of element abbreviations to their full names
    const elements : { [key: string]: string } = {
        'oer': 'O E R',
        'OER': 'O E R',
        'mor': 'M O R',
        'MOR': 'M O R',
        'DFFC': 'direct formate fuel cell',
        'Pt': 'Platinum',
        'Ru': 'Ruthenium',
        'Sc': 'Scandium',
        'Ir': 'Iridium',
        'Ni': 'Nickel',
        'Cu': 'Copper',
        'Zn': 'Zinc',
        'Fe': 'Iron',
        'Co': 'Cobalt',
        '*': '',
    };

    // Replace each element abbreviation with its full name
    for (const abbreviation in elements) {
        const regex = new RegExp('\\b' + abbreviation + '\\b', 'g');
        text = text.replace(regex, elements[abbreviation]);
    }

    return text;
}