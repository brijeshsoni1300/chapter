import { gql } from '@apollo/client';

export const EVENTS = gql`
  query events {
    events(showAll: true) {
      id
      name
      canceled
      description
      url
      invite_only
      streaming_url
      start_at
      capacity
      venue_type
      venue {
        id
        name
      }
      tags {
        tag {
          id
          name
        }
      }
    }
  }
`;

export const EVENT = gql`
  query event($eventId: Int!) {
    event(eventId: $eventId) {
      id
      name
      description
      url
      invite_only
      streaming_url
      canceled
      capacity
      start_at
      ends_at
      image_url
      chapter {
        id
        name
      }
      tags {
        tag {
          id
          name
        }
      }
      sponsors {
        sponsor {
          name
          website
          logo_path
          type
          id
        }
      }
      venue_type
      venue {
        id
        name
        street_address
        city
        postal_code
        region
        country
      }
      event_users {
        rsvp {
          name
        }
        user {
          id
          name
        }
        event_role {
          id
          name
          event_role_permissions {
            event_permission {
              name
            }
          }
        }
        subscribed
      }
    }
  }
`;

export const EVENT_WITH_VENU = gql`
  query eventVenues($eventId: Int!) {
    event(eventId: $eventId) {
      id
      name
      description
      url
      streaming_url
      capacity
      start_at
      ends_at
      tags {
        tag {
          id
          name
        }
      }
      venue {
        id
      }
    }
    venues {
      id
      name
    }
  }
`;

export const Sponsors = gql`
  query sponsors {
    sponsors {
      id
      name
      website
      logo_path
      type
    }
  }
`;

export const EventRoles = gql`
  query eventRoles {
    eventRoles {
      id
      name
    }
  }
`;
