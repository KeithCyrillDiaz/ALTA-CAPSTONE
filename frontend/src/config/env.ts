
console.log("import.meta.env: ", import.meta.env); 

const envConfig = {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL,

}

export default envConfig;