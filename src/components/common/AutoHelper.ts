import * as ImagePicker from 'expo-image-picker';

const fetcher = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(url, options);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || result.error || "An error occurred");
    }

    return { data: result.data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || "Fetch failed" };
  }
};

const poster = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        ...(options.headers || {}),
      },
      body: JSON.stringify(options.body || {}),
      ...options,
    });
    
    console.log('raw', response);

    const result = await response.json();

    console.log("Poster response:", result);

    if (!response.ok) {
      throw new Error(result.message || result.errors || "An error occurred");
    }

    return { data: result, error: null };
  } catch (error: any) {
    return { data: null, error: error || "Post failed" };
  }
};

const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      return result.assets[0].uri;
    } else {
      alert('You did not select any image.');
    }
  };

export { fetcher, poster, pickImageAsync };
