import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import mockData from './data';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useQuery, useLazyQuery, useApolloClient } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const GET_LESSONS = gql`
  query($start: String!, $end: String!) {
    getLessons(start: $start, end: $end) {
      StartTime
      EndTime
      Subject
      ClassRoom
      Teacher
    }
  }
`;

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const UserList = () => {
  const classes = useStyles();

  // const { loading, error, data } = useQuery(GET_LESSONS);
  const client = useApolloClient();
  // const [getLessons, { loading, error, data }] = useLazyQuery(GET_LESSONS);

  // if (loading || !data) return <p>Loading ...</p>;
  // if (error) return <p>Error</p>;

  return (
    <div>
      <FullCalendar
        defaultView="timeGridWeek"
        plugins={[timeGridPlugin]}
        events={async (info, successCallback, failureCallback) => {
          try {
            console.log(info);

            const { data } = await client.query({
              query: GET_LESSONS,
              variables: {
                start: info.start,
                end: info.end
              }
            });
            const events = data.getLessons.map(lesson => ({
              title: lesson.Subject,
              start: lesson.StartTime,
              end: lesson.EndTime,
              extendedProps: {
                classRoom: lesson.ClassRoom
              },
              description: lesson.Teacher
            }));
            successCallback(events);
          } catch (error) {
            failureCallback(error);
          }
        }}
      />
    </div>
  );
};

export default UserList;
