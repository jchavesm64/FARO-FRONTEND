export const ackBookingRevisionMutation = gql`
  mutation ackBookingRevision($id: String!) {
    ackBookingRevision(id: $id) {
      status
      data
      message
    }
  }
`;

export const getBookingRevisionsQuery = gql`
  query {
    getBookingRevisions {
      status
      data {
        attributes {
          acknowledgeStatus
          propertyId
          bookingId
          uniqueId
          otaReservationCode
          otaName
          status
          rooms {
            amount
            checkinDate
            checkoutDate
            ratePlanId
            roomTypeId
            otaUniqueId
            days {
              date
              amount
            }
            occupancy {
              adults
              children
              infants
            }
          }
          services {
            type
            totalPrice
            pricePerUnit
            priceMode
            persons
            nights
            name
          }
          guarantee {
            expirationDate
            cvv
            cardholderName
            cardType
            cardNumber
          }
          customer {
            zip
            surname
            phone
            name
            mail
            language
            country
            city
            address
            company {
              title
              number
              numberType
              type
            }
          }
          occupancy {
            adults
            children
            infants
          }
          arrivalDate
          departureDate
          arrivalHour
          amount
          otaCommission
          currency
          notes
          insertedAt
        }
      }
      message
    }
  }
`;

export const getBookingRevisionsFeedQuery = gql`
  query {
    getBookingRevisionsFeed {
      status
      data {
        attributes {
          acknowledgeStatus
          propertyId
          bookingId
          uniqueId
          otaReservationCode
          otaName
          status
          rooms {
            amount
            checkinDate
            checkoutDate
            ratePlanId
            roomTypeId
            otaUniqueId
            days {
              date
              amount
            }
            occupancy {
              adults
              children
              infants
            }
          }
          services {
            type
            totalPrice
            pricePerUnit
            priceMode
            persons
            nights
            name
          }
          guarantee {
            expirationDate
            cvv
            cardholderName
            cardType
            cardNumber
          }
          customer {
            zip
            surname
            phone
            name
            mail
            language
            country
            city
            address
            company {
              title
              number
              numberType
              type
            }
          }
          occupancy {
            adults
            children
            infants
          }
          arrivalDate
          departureDate
          arrivalHour
          amount
          otaCommission
          currency
          notes
          insertedAt
        }
      }
      message
    }
  }
`;

export const getBookingRevisionByIdQuery = gql`
  query getBookingRevisionById($id: String!) {
    getBookingRevisionById(id: $id) {
      status
      data {
        attributes {
          acknowledgeStatus
          propertyId
          bookingId
          uniqueId
          otaReservationCode
          otaName
          status
          rooms {
            amount
            checkinDate
            checkoutDate
            ratePlanId
            roomTypeId
            otaUniqueId
            days {
              date
              amount
            }
            occupancy {
              adults
              children
              infants
            }
          }
          services {
            type
            totalPrice
            pricePerUnit
            priceMode
            persons
            nights
            name
          }
          guarantee {
            expirationDate
            cvv
            cardholderName
            cardType
            cardNumber
          }
          customer {
            zip
            surname
            phone
            name
            mail
            language
            country
            city
            address
            company {
              title
              number
              numberType
              type
            }
          }
          occupancy {
            adults
            children
            infants
          }
          arrivalDate
          departureDate
          arrivalHour
          amount
          otaCommission
          currency
          notes
          insertedAt
        }
      }
      message
    }
  }
`;
