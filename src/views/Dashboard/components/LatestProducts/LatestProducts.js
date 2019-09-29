import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton
} from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import formatDistance from 'date-fns/formatDistance';
import huLocale from 'date-fns/locale/hu';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  },
  content: {
    padding: 0
  },
  image: {
    height: 48,
    width: 48
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

const LatestProducts = props => {
  const { className, evaluations, ...rest } = props;

  const classes = useStyles();

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader
        subtitle={`${evaluations.length} in total`}
        title="Legutóbbi értékelések"
      />
      <Divider />
      <CardContent className={classes.content}>
        <List>
          {evaluations.map((evaluation, i) => {
            const created = formatDistance(
              new Date(evaluation.Date),
              new Date(),
              {
                locale: huLocale
              }
            );
            return (
              <ListItem
                divider={i < evaluation.length - 1}
                key={evaluation.EvaluationId}>
                <ListItemText>{evaluation.NumberValue}</ListItemText>
                <ListItemText
                  primary={evaluation.Subject}
                  secondary={created}
                />
                <IconButton edge="end" size="small">
                  <MoreVertIcon />
                </IconButton>
              </ListItem>
            );
          })}
        </List>
      </CardContent>
      <Divider />
      <CardActions className={classes.actions}>
        <Button color="primary" size="small" variant="text">
          View all <ArrowRightIcon />
        </Button>
      </CardActions>
    </Card>
  );
};

LatestProducts.propTypes = {
  className: PropTypes.string
};

export default LatestProducts;
