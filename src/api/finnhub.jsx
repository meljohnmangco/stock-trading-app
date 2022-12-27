import axios from "axios"

const TOKEN = "cekeupaad3i2p0avci3gcekeupaad3i2p0avci40"

export default axios.create({
	baseURL: "https://finnhub.io/api/v1",
	params: {
		token: TOKEN
	}
})