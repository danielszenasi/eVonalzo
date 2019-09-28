import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import { gql } from 'apollo-boost';

import { LatestProducts } from './components';
import { useQuery } from '@apollo/react-hooks';

const GET_STUDENT = gql`
  query {
    getStudent {
      Evaluations {
        EvaluationId
        Subject
        NumberValue
        Date
        Mode
      }
    }
  }
`;

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Dashboard = () => {
  const classes = useStyles();

  const { loading, error, data } = useQuery(GET_STUDENT);
  if (loading || !data) return <p>Loading ...</p>;
  if (error) return <p>Error</p>;

  console.log(data);

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        {/* <Grid item lg={3} sm={6} xl={3} xs={12}>
          <Budget />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <TotalUsers />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <TasksProgress />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <TotalProfit />
        </Grid>
        <Grid item lg={8} md={12} xl={9} xs={12}>
          <LatestSales />
        </Grid>
        <Grid item lg={4} md={6} xl={3} xs={12}>
          <UsersByDevice />
        </Grid> */}
        <Grid item lg={4} md={6} xl={3} xs={12}>
          <LatestProducts evaluations={data.getStudent.Evaluations} />
        </Grid>
        {/* <Grid item lg={8} md={12} xl={9} xs={12}>
          <LatestOrders />
        </Grid> */}
      </Grid>
    </div>
  );
};

export default Dashboard;
