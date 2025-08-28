import React, { useContext, useEffect } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({category}) => {

    const {food_list} = useContext(StoreContext)

    // This block will help us debug the issue
    useEffect(() => {
        if (food_list.length > 0) {
            // This creates a list of all unique category names from your food data
            const uniqueCategories = [...new Set(food_list.map(item => item.category))];
            console.log("Categories available in food_list data:", uniqueCategories);
        }
    }, [food_list]);

  return (
    <div className='food-display' id='food-display'>
        <h2>Our Foods</h2>
        <div className="food-display-list">
            {food_list.map((item,index) => {
                if(category==="All" || category.toLowerCase()===item.category.toLowerCase()){
                    return <FoodItem key={item._id} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image} />
                }
            })}
        </div>
    </div>
  )
}

export default FoodDisplay