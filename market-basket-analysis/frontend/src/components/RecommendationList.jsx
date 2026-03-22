const RecommendationList = ({ recommendations }) => {
  return (
    <ul>
      {recommendations.map((rec, index) => <li key={index}>{rec}</li>)}
    </ul>
  );
};

export default RecommendationList;