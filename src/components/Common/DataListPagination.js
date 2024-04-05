import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const DataListPagination = ({ ...props }) => {
    const { type, length, displayLength, activePage, setPage } = props

    const getItems = () => {
        var pages = parseInt(length / displayLength)
        if(length % displayLength !== 0){
            pages += 1;
        }
        var array = []
        array.push(
            <li key="prev" className="page-item" onClick={() => {localStorage.setItem('active_page_'+type, 1); setPage(1)}}>
                <Link className="page-link" to="#" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                    <span className="sr-only">Previous</span>
                </Link>
            </li>
        )


        if (pages <= 5) {
            for (let i = 1; i <= pages; i++) {
                array.push(<li key={`${i}-0`} className={activePage === i ? 'page-item active' : 'page-item '} onClick={() => {localStorage.setItem('active_page_'+type, i); setPage(i)}}><Link className="page-link" to="#">{i}</Link></li>)
            }   
        }else{
            if(activePage < 4){
                for (let i = 1; i <= 5; i++) {
                    
                    array.push(<li key={`${i}-1`} className={activePage === i ? 'page-item active' : 'page-item '} onClick={() => {localStorage.setItem('active_page_'+type, i); setPage(i)}}><Link className="page-link" to="#">{i}</Link></li>)
                    
                }
            }else if((activePage + 2) < pages){
                for (let i = (activePage - 2); i <= (activePage + 2); i++) {
                    array.push(<li key={`${i}-2`} className={activePage === i ? 'page-item active' : 'page-item '} onClick={() => {localStorage.setItem('active_page_'+type, i); setPage(i)}}><Link className="page-link" to="#">{i}</Link></li>)
                }
            }else{
                for (let i = (pages - 5); i <= pages; i++) {
                    array.push(<li key={`${i}-3`} className={activePage === i ? 'page-item active' : 'page-item '} onClick={() => {localStorage.setItem('active_page_'+type, i); setPage(i)}}><Link className="page-link" to="#">{i}</Link></li>)
                }
            }
        }
        
        array.push(
            <li key="next"  className="page-item" onClick={() => {localStorage.setItem('active_page_'+type, pages); setPage(pages)}}>
                <Link className="page-link" to="#" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                    <span className="sr-only">Next</span>
                </Link>
            </li>
        )
        
        return array
    }


    return (
        <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-center">
                {
                    getItems()
                }
            </ul>
        </nav>
    )
}

export default DataListPagination