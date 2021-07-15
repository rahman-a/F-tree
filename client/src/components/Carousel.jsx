import { Carousel } from "react-bootstrap"

const CarouselBlock = ({images}) => {
    return (
        <Carousel>
           
            {
                images && images.map(image => (
                    <Carousel.Item>
                    <img
                    className="d-block w-100"
                    src={`/uploads/${image}`}
                    alt="First slide"
                    />
                    </Carousel.Item> 
                ))
            }
        </Carousel>
    )
}

export default CarouselBlock
