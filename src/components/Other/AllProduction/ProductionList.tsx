import type { JSX } from "react";
import { useParams } from "react-router-dom";
import Shirt from "./Shirt";
import Pant from "./Pant";
import Dress from "./Dress";
import Skirt from "./Skirt";
import Shoes from "./Shoes";
import Bag from "./Bag";

const ProductList = (): JSX.Element => {
    const {category} = useParams();
    return(
        <>
            {
                category == "shirt" && (
                    <Shirt />
                )
            }
            {
                category == "pant" && (
                    <Pant />
                )
            }
            {
                category == "dress" && (
                    <Dress />
                )
            }
            {
                category == "skirt" && (
                    <Skirt />
                )
            }
            {
                category == "shoes" && (
                    <Shoes />
                )
            }
            {
                category == "bag" && (
                    <Bag />
                )
            }
        </>
    )
}

export default ProductList