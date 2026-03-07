import axios, { AxiosError } from 'axios';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const apiToken = process.env.EXPO_PUBLIC_API_TOKEN; ///remover 

const login = async (cpf: string, password: string) => {
    const response = await axios.post(`${apiUrl}/login`, {
        cpf: cpf, password: password,
    }, {
        headers: {
            "ApiToken": apiToken
        }
    })
        .catch((error: AxiosError) => {
            console.log(error.code)
            const cause = error.code === "ERR_NETWORK" ? "NETWORK" : error.code === "ERR_BAD_REQUEST" ? "LOGIN" : "OTHER"
            return {
                data: "",
                status: cause,
            }
        });

    return {
        data: response.data,
        status: response.status,
    }
}

const logout = async (token: string) => {
    const response = await axios.post(`${apiUrl}/logout`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
            "ApiToken": apiToken
        }
    }).catch((error: AxiosError) => {
        console.log(error)
    });
    console.log(response)
}

const forgot = async (cpf: string, date_birth: string) => {
    const response = await axios.post(`${apiUrl}/users/newpassword`, {
        cpf: cpf, date_birth: date_birth,

    }, {
        headers: {
            "ApiToken": apiToken
        }
    }
    ).catch((error: AxiosError) => {
        console.log("erro do axios - auth");
        console.log(apiToken);
        console.log(error);
    });

    if (response) {
        return response?.data?.email
    }
    else {
        return false
    }
}

export { login, logout, forgot }