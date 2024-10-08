import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const wakeUpBackend = async () => {
    const response = await axios.get(`${API_URL}/wakeUp`);
    return response.data;
};

export const analyzeDocument = async (file, query) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('query', query);

    try {
        const response = await axios.post(`${API_URL}/analyze`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.result;
    } catch (error) {
        console.error('Analysis error:', error);
        throw new Error(
            error.response?.data?.error || 'An error occurred during analysis'
        );
    }
};
