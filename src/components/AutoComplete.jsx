import { useState, useEffect, useContext } from "react"
import { WatchListContext } from "../context/watchListContext"
import finnHub from "../api/finnHub"

export const AutoComplete = () => {
	const [search, setSearch] = useState("")
	const [results, setResults] = useState([])
	const { addStock } = useContext(WatchListContext)

	const renderDropDown = () => {
		const dropDownClass = search ? "show" : null
		return (
			<ul className={`dropdown-menu ${dropDownClass}`} 
			style={{
				height:"500px",
				overflowY: "scroll",
				overflowX: "hidden",
				cursor: "pointer"
			}}>
				{results.map((result) => {
					return (
						<li onClick={() => {
							addStock(result.symbol)
							setSearch("")
						}} key={result.symbol} className="dropdown-item">{result.description} ({result.symbol})</li>
					)
				})}
			</ul>
		)
	}

	useEffect(() => {
	let isMounted = true		
		const fetchData = async () => {
			try {
				const response = await finnHub.get("/search", {
					params: {
						q: search
					}
				})
				if (isMounted) {
					setResults(response.data.result)
				}
			} catch(err) {

			}
		}
		if(search.length > 0) {
			fetchData()
		} else {
			//setresults into an empty an array when user deletes letter in the inputbox
			setResults([])
		}
		return () => (isMounted = false)
		//search as dependency for useEffect return only when search is change 
	},[search])

	return (
		<div className="w-50 p-5 rounder mx-auto">
			<div className="form-floating dropdown">
				<input type="text" 
					style={{backgroundColor: "rgba(145, 158, 171, 0.4)"}} 
					id="search" 
					className="form-control" 
					placeholder="Search" 
					autoComplete="off" 
					value={search} 
					onChange={(e) => setSearch(e.target.value)} />
				<label htmlFor="search">Search</label>
				{renderDropDown()}
			</div>
		</div>
	)
}