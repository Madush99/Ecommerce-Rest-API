import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import Rating from './Rating'
import './style.css'

const Product = ({ product }) => {
      return (
            <Card className='my-3 p-3 rounded'>
                  <Link to={`/product/${product._id}`}>
                        <Card.Img className='card-img' src={product.image} variant='top' />
                  </Link>

                  <Card.Body>
                        <Link to={`/product/${product._id}`}>
                              <Card.Title as='div'><strong>{product.name}</strong></Card.Title>
                        </Link>

                        <Card.Text as='div'>
                              <Rating
                                    value={product.rating}
                                    text={`${product.numReviews}`}

                              />

                        </Card.Text>
                        <Card.Text as='h3'>
                              Rs.{product.price}
                        </Card.Text>
                  </Card.Body>
            </Card>
      )
}

export default Product
