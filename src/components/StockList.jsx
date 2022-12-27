import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import finnHub from "../api/finnHub"
import {BsFillCaretUpFill} from "react-icons/bs"
import { WatchListContext } from "../context/watchListContext"
import {BsFillCaretDownFill} from "react-icons/bs"

export const StockList = () => {
	const [stock, setStock] = useState([])

	//retriev a prop from watchlist context [not the provider]
	const { watchList, deleteStock } = useContext(WatchListContext)
	const navigate = useNavigate()
	

	const changeColor = (change) => {
		return change > 0 ? "success" : "danger"
	}

	const renderIcon = (change) => {
		return change > 0 ? <BsFillCaretUpFill /> : <BsFillCaretDownFill />
	}

	useEffect (() => {
		let isMounted = true
		const fetchData = async () => {
			const responses = []

			try {
				const responses = await Promise.all(watchList.map((stock) => {
					return finnHub.get("/quote", {
						params: {
							symbol: stock
						}
					})
				}))
				const data = responses.map((response) => {
					return {
						data: response.data,
						symbol: response.config.params.symbol
					}
				})
				//prevents from calling setStock while it has already unmounted
				if(isMounted) {
					setStock(data)					
				}
			} catch (err) {

			}
		}
		fetchData()

		return () => (isMounted = false)
	//runs useeffect everytime watchList get updated
	}, [watchList])

	const handleStockSelect = (symbol) => {
		navigate(`detail/${symbol}`)
	}

	return (
		<div>
			<table className="table hover mt-5 table-secondary">
				<thead style={{color: "rgb(79,89,102)"}}>
					<tr>
						<th scope="col">Name</th>
						<th scope="col">Last</th>
						<th scope="col">Chg</th>
						<th scope="col">Chg%</th>
						<th scope="col">High</th>
						<th scope="col">Low</th>
						<th scope="col">Open</th>
						<th scope="col">Pclose</th>
					</tr>
				</thead>
				<tbody>
					{stock.map((stockData) => {
						return (
							<tr style={{cursor:"pointer"}} onClick={() => handleStockSelect(stockData.symbol)} className="table-row table-primary" key={stockData.symbol}>
								<th scope="row" >{stockData.symbol}</th>
								<td>{stockData.data.c}</td>
								<td className={`text-${changeColor(stockData.data.d)}`}>{stockData.data.d} {renderIcon(stockData.data.dp)}</td>
								<td className={`text-${changeColor(stockData.data.dp)}`}>{stockData.data.dp} {renderIcon(stockData.data.dp)}</td>
								<td>{stockData.data.h}</td>
								<td>{stockData.data.l}</td>
								<td>{stockData.data.o}</td>
								<td>{stockData.data.pc} 
									<button className="btn btn-danger btn-sm ml-5 d-inline delete-button" onClick={(e) => {
										//stops the event from bubbling to the parent component
										e.stopPropagation()
										deleteStock(stockData.symbol)}}>Remove</button>
								</td>
							</tr>
						)	
					})}
				</tbody>
			</table>
		</div>
	)
}