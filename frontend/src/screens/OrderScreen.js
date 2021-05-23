import React, { useState, useEffect } from 'react'
import axios from 'axios'
import emailjs from "emailjs-com";
import { PayPalButton } from 'react-paypal-button-v2'
import { Link } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Card, Button, Form, Alert } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions'
import { ORDER_PAY_RESET, ORDER_DELIVERED_RESET } from '../constants/orderConstants'

const OrderScreen = ({ match, history }) => {
      const orderId = match.params.id

      const [sdkReady, setSdkReady] = useState(false)

      const dispatch = useDispatch()

      const orderDetails = useSelector((state) => state.orderDetails)
      const { order, loading, error } = orderDetails

      const orderPay = useSelector((state) => state.orderPay)
      const { loading: loadingPay, success: successPay } = orderPay

      const orderDeliver = useSelector((state) => state.orderDeliver)
      const { loading: loadingDeliver, success: successDeliver } = orderDeliver

      const userLogin = useSelector((state) => state.userLogin)
      const { userInfo } = userLogin

      // var templateParams = {
      //       email: order.user.email,
      // };




      if (!loading) {
            //   Calculate prices
            const addDecimals = (num) => {
                  return (Math.round(num * 100) / 100).toFixed(2)
            }

            order.itemsPrice = addDecimals(
                  order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
            )
      }

      useEffect(() => {

            if (!userInfo) {
                  history.push('/login')
            }
            //paypal payment gateway
            const addPayPalScript = async () => {
                  const { data: clientId } = await axios.get('/api/config/paypal')
                  const script = document.createElement('script')
                  script.type = 'text/javascript'
                  script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
                  script.async = true
                  script.onload = () => {
                        setSdkReady(true)
                  }
                  document.body.appendChild(script)
            }

            if (!order || successPay || successDeliver) {
                  dispatch({ type: ORDER_PAY_RESET })
                  dispatch({ type: ORDER_DELIVERED_RESET })
                  dispatch(getOrderDetails(orderId))
            } else if (!order.isPaid) {
                  if (!window.paypal) {
                        addPayPalScript()
                  } else {
                        setSdkReady(true)
                  }
            }
      }, [dispatch, orderId, successPay, successDeliver, order])

      const successPaymentHandler = (paymentResult) => {
            console.log(paymentResult)
            dispatch(payOrder(orderId, paymentResult))
      }

      const deliverHandler = () => {
            dispatch(deliverOrder(order))
      }

      //email sending function 

      function sendEmail(e) {
            e.preventDefault();

            emailjs.sendForm('service_3hmhlvx', 'template_j57onor', e.target, 'user_xybrFSQSULyS71kBVHmzl')
                  .then((result) => {
                        console.log(result.text);
                  }, (error) => {
                        console.log(error.text);
                  });
      }

      return loading ? (
            <Loader />
      ) : error ? (
            <Message variant='danger'>{error}</Message>
      ) : (
            <>
                  <h1>Order {order._id}</h1>
                  <Row>
                        <Col md={8}>
                              <ListGroup variant='flush'>
                                    <ListGroup.Item>
                                          <h2>Shipping</h2>
                                          <p>
                                                <strong>Name: </strong> {order.user.name}
                                          </p>
                                          <p>
                                                <strong>Email: </strong>{' '}
                                                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                                          </p>
                                          <p>
                                                <strong>Address:</strong>
                                                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                                                {order.shippingAddress.postalCode},{' '}
                                                {order.shippingAddress.country}
                                          </p>
                                          {order.isDelivered ? (
                                                <Message variant='success'>
                                                      Delivered on {order.deliveredAt}
                                                </Message>
                                          ) : (
                                                <Message variant='danger'>Not Delivered</Message>
                                          )}
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                          <h2>Payment Method</h2>
                                          <p>
                                                <strong>Method: </strong>
                                                {order.paymentMethod}
                                          </p>
                                          {order.isPaid ? (
                                                <Message variant='success'>Paid on {order.paidAt}</Message>
                                          ) : (
                                                <Message variant='danger'>Not Paid</Message>
                                          )}
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                          <h2>Order Items</h2>
                                          {order.orderItems.length === 0 ? (
                                                <Message>Order is empty</Message>
                                          ) : (
                                                <ListGroup variant='flush'>
                                                      {order.orderItems.map((item, index) => (
                                                            <ListGroup.Item key={index}>
                                                                  <Row>
                                                                        <Col md={1}>
                                                                              <Image
                                                                                    src={item.image}
                                                                                    alt={item.name}
                                                                                    fluid
                                                                                    rounded
                                                                              />
                                                                        </Col>
                                                                        <Col>
                                                                              <Link to={`/product/${item.product}`}>
                                                                                    {item.name}
                                                                              </Link>
                                                                        </Col>
                                                                        <Col md={4}>
                                                                              {item.qty} x ${item.price} = ${item.qty * item.price}
                                                                        </Col>
                                                                  </Row>
                                                            </ListGroup.Item>
                                                      ))}
                                                </ListGroup>
                                          )}
                                    </ListGroup.Item>
                              </ListGroup>
                        </Col>
                        <Col md={4}>
                              <Card>
                                    <ListGroup variant='flush'>
                                          <ListGroup.Item>
                                                <h2>Order Summary</h2>
                                          </ListGroup.Item>
                                          <ListGroup.Item>
                                                <Row>
                                                      <Col>Items</Col>
                                                      <Col>Rs.{order.itemsPrice}</Col>
                                                </Row>
                                          </ListGroup.Item>
                                          <ListGroup.Item>
                                                <Row>
                                                      <Col>Shipping</Col>
                                                      <Col>Rs.{order.shippingPrice}</Col>
                                                </Row>
                                          </ListGroup.Item>
                                          <ListGroup.Item>
                                                <Row>
                                                      <Col>Tax</Col>
                                                      <Col>Rs.{order.taxPrice}</Col>
                                                </Row>
                                          </ListGroup.Item>
                                          <ListGroup.Item>
                                                <Row>
                                                      <Col>Total</Col>
                                                      <Col>Rs.{order.totalPrice}</Col>
                                                </Row>
                                          </ListGroup.Item>

                                          {/* Payment via paypal and credit or debit card */}
                                          {!order.isPaid && (
                                                <ListGroup.Item>
                                                      {loadingPay && <Loader />}
                                                      {!sdkReady ? (
                                                            <Loader />
                                                      ) : (

                                                            <PayPalButton
                                                                  amount={order.totalPrice}
                                                                  onSuccess={successPaymentHandler}

                                                            />

                                                      ) || (
                                                            <Button
                                                                  amount={order.totalPrice}
                                                                  onSuccess={successPaymentHandler}
                                                            />
                                                      )}
                                                </ListGroup.Item>
                                          )}
                                          {/* Sending email to client after payment is done */}
                                          {order.isPaid && (



                                                // Calling the sendEmail function 

                                                <Form onSubmit={sendEmail} className='py-2' align='center'>
                                                      <input type="hidden" className="form-control" placeholder="Name" name="email" value={order.user.email} />
                                                      <input type="hidden" className="form-control" placeholder="Name" name="itemsPrice" value={order.itemsPrice} />
                                                      <input type="hidden" className="form-control" placeholder="Name" name="shippingPrice" value={order.shippingPrice} />
                                                      <input type="hidden" className="form-control" placeholder="Name" name="tax" value={order.taxPrice} />
                                                      <input type="hidden" className="form-control" placeholder="Name" name="totalPrice" value={order.totalPrice} />

                                                      <Button className='py-2 mj' type='submit' >Send Order Summary</Button>




                                                </Form>


                                          )}

                                          {loadingDeliver && <Loader />}

                                          {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                                <ListGroup.Item>
                                                      <Button type='button' className='btn btn-block' onClick={deliverHandler}>
                                                            Mark as delivered
                                                      </Button>
                                                </ListGroup.Item>
                                          )}
                                    </ListGroup>
                              </Card>
                        </Col>
                  </Row>
            </>
      )
}

export default OrderScreen