import { createContext, useState, useEffect } from "react"

export const WatchListContext = createContext()

export const WatchListContextProvider = (props) => {

	const [watchList, setWatchList ] = useState(
		// ---> [?] checks if storage exists
		localStorage.getItem("watchList")?.split(",") || ["GOOGL","MSFT", "AMZN"]
	)

	useEffect(() => {
		localStorage.setItem("watchList", watchList)
	},[watchList])

	const addStock = (stock) => {
		//checks if the stock is already in the list
		if(watchList.indexOf(stock) === -1) {
			//adds stock to the watchlists
			setWatchList([...watchList, stock])
		}
	}

	const deleteStock = (stock) => {
		setWatchList(watchList.filter((el) => {
			return el != stock
		}))
	}

	return <WatchListContext.Provider value={{ watchList, addStock, deleteStock }}>
		{props.children}
	</WatchListContext.Provider>
}