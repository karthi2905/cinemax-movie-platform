/**
 * Evaluation Metrics System for Recommendation Engine
 * Implements RMSE, MAE, Precision, Recall, F1-Score, NDCG, and other metrics
 */

class EvaluationMetrics {
  constructor() {
    this.metrics = {};
    this.evaluationHistory = [];
  }

  /**
   * ROOT MEAN SQUARE ERROR (RMSE)
   * Measures prediction accuracy - lower is better
   */
  calculateRMSE(predictions, actualRatings) {
    if (predictions.length !== actualRatings.length) {
      throw new Error('Predictions and actual ratings arrays must have the same length');
    }

    let sumSquaredError = 0;
    let count = 0;

    for (let i = 0; i < predictions.length; i++) {
      if (predictions[i] !== null && actualRatings[i] !== null) {
        const error = predictions[i] - actualRatings[i];
        sumSquaredError += error * error;
        count++;
      }
    }

    if (count === 0) return null;
    
    const rmse = Math.sqrt(sumSquaredError / count);
    return rmse;
  }

  /**
   * MEAN ABSOLUTE ERROR (MAE)
   * Alternative to RMSE, less sensitive to outliers
   */
  calculateMAE(predictions, actualRatings) {
    if (predictions.length !== actualRatings.length) {
      throw new Error('Predictions and actual ratings arrays must have the same length');
    }

    let sumAbsoluteError = 0;
    let count = 0;

    for (let i = 0; i < predictions.length; i++) {
      if (predictions[i] !== null && actualRatings[i] !== null) {
        sumAbsoluteError += Math.abs(predictions[i] - actualRatings[i]);
        count++;
      }
    }

    if (count === 0) return null;
    
    return sumAbsoluteError / count;
  }

  /**
   * PRECISION @ K
   * What fraction of recommended items are relevant?
   */
  calculatePrecision(recommendedItems, relevantItems, k = null) {
    const topK = k ? recommendedItems.slice(0, k) : recommendedItems;
    const relevantSet = new Set(relevantItems);
    
    let relevantRecommended = 0;
    for (const item of topK) {
      if (relevantSet.has(item)) {
        relevantRecommended++;
      }
    }

    return topK.length > 0 ? relevantRecommended / topK.length : 0;
  }

  /**
   * RECALL @ K
   * What fraction of relevant items are recommended?
   */
  calculateRecall(recommendedItems, relevantItems, k = null) {
    const topK = k ? recommendedItems.slice(0, k) : recommendedItems;
    const recommendedSet = new Set(topK);
    
    let relevantRecommended = 0;
    for (const item of relevantItems) {
      if (recommendedSet.has(item)) {
        relevantRecommended++;
      }
    }

    return relevantItems.length > 0 ? relevantRecommended / relevantItems.length : 0;
  }

  /**
   * F1-SCORE
   * Harmonic mean of precision and recall
   */
  calculateF1Score(precision, recall) {
    if (precision + recall === 0) return 0;
    return 2 * (precision * recall) / (precision + recall);
  }

  /**
   * NORMALIZED DISCOUNTED CUMULATIVE GAIN (NDCG)
   * Measures ranking quality - higher is better
   */
  calculateNDCG(recommendedItems, relevanceScores, k = null) {
    const topK = k ? recommendedItems.slice(0, k) : recommendedItems;
    
    // Calculate DCG (Discounted Cumulative Gain)
    let dcg = 0;
    for (let i = 0; i < topK.length; i++) {
      const item = topK[i];
      const relevance = relevanceScores[item] || 0;
      dcg += relevance / Math.log2(i + 2); // i+2 because log2(1) = 0
    }

    // Calculate IDCG (Ideal DCG) - best possible ranking
    const sortedRelevance = Object.values(relevanceScores)
      .sort((a, b) => b - a)
      .slice(0, topK.length);
    
    let idcg = 0;
    for (let i = 0; i < sortedRelevance.length; i++) {
      idcg += sortedRelevance[i] / Math.log2(i + 2);
    }

    return idcg > 0 ? dcg / idcg : 0;
  }

  /**
   * MEAN RECIPROCAL RANK (MRR)
   * Average of reciprocal ranks of first relevant item
   */
  calculateMRR(queryResults, relevantItems) {
    let sumReciprocalRank = 0;
    let queryCount = 0;

    for (const query of queryResults) {
      const relevantSet = new Set(relevantItems[query.id] || []);
      let reciprocalRank = 0;

      for (let i = 0; i < query.recommendations.length; i++) {
        if (relevantSet.has(query.recommendations[i])) {
          reciprocalRank = 1 / (i + 1);
          break;
        }
      }

      sumReciprocalRank += reciprocalRank;
      queryCount++;
    }

    return queryCount > 0 ? sumReciprocalRank / queryCount : 0;
  }

  /**
   * COVERAGE
   * What fraction of items can be recommended?
   */
  calculateCoverage(allRecommendations, totalItems) {
    const uniqueRecommendations = new Set();
    
    for (const recommendations of allRecommendations) {
      for (const item of recommendations) {
        uniqueRecommendations.add(item);
      }
    }

    return totalItems > 0 ? uniqueRecommendations.size / totalItems : 0;
  }

  /**
   * DIVERSITY
   * Average pairwise distance between recommended items
   */
  calculateDiversity(recommendations, similarityMatrix) {
    if (recommendations.length < 2) return 0;

    let totalDistance = 0;
    let pairCount = 0;

    for (let i = 0; i < recommendations.length; i++) {
      for (let j = i + 1; j < recommendations.length; j++) {
        const item1 = recommendations[i];
        const item2 = recommendations[j];
        
        // Distance = 1 - similarity
        const similarity = similarityMatrix[item1] && similarityMatrix[item1][item2] 
          ? similarityMatrix[item1][item2] : 0;
        
        totalDistance += (1 - similarity);
        pairCount++;
      }
    }

    return pairCount > 0 ? totalDistance / pairCount : 0;
  }

  /**
   * NOVELTY
   * How novel/non-obvious are the recommendations?
   */
  calculateNovelty(recommendations, itemPopularities) {
    let totalNovelty = 0;

    for (const item of recommendations) {
      const popularity = itemPopularities[item] || 0;
      // Novelty is inverse of popularity
      const novelty = popularity > 0 ? -Math.log2(popularity) : 0;
      totalNovelty += novelty;
    }

    return recommendations.length > 0 ? totalNovelty / recommendations.length : 0;
  }

  /**
   * SERENDIPITY
   * Unexpected but relevant recommendations
   */
  calculateSerendipity(recommendations, userProfile, relevanceScores) {
    let serendipityScore = 0;

    for (const item of recommendations) {
      const relevance = relevanceScores[item] || 0;
      const expectedness = this.calculateExpectedness(item, userProfile);
      
      // Serendipity = relevance * (1 - expectedness)
      serendipityScore += relevance * (1 - expectedness);
    }

    return recommendations.length > 0 ? serendipityScore / recommendations.length : 0;
  }

  /**
   * CROSS-VALIDATION EVALUATION
   */
  performCrossValidation(data, algorithm, folds = 5) {
    const foldSize = Math.floor(data.length / folds);
    const results = {
      rmse: [],
      mae: [],
      precision: [],
      recall: [],
      f1: [],
      ndcg: []
    };

    for (let i = 0; i < folds; i++) {
      const testStart = i * foldSize;
      const testEnd = i === folds - 1 ? data.length : testStart + foldSize;
      
      const testSet = data.slice(testStart, testEnd);
      const trainSet = [...data.slice(0, testStart), ...data.slice(testEnd)];

      // Train algorithm on training set
      const model = algorithm.train(trainSet);
      
      // Test on test set
      const predictions = testSet.map(item => model.predict(item));
      const actualValues = testSet.map(item => item.rating);

      // Calculate metrics
      const rmse = this.calculateRMSE(predictions, actualValues);
      const mae = this.calculateMAE(predictions, actualValues);
      
      if (rmse !== null) results.rmse.push(rmse);
      if (mae !== null) results.mae.push(mae);

      // For ranking metrics, need to generate recommendations
      const recommendations = model.getRecommendations(testSet, 10);
      const relevantItems = testSet.filter(item => item.rating >= 4).map(item => item.movieId);
      
      const precision = this.calculatePrecision(recommendations, relevantItems);
      const recall = this.calculateRecall(recommendations, relevantItems);
      const f1 = this.calculateF1Score(precision, recall);

      results.precision.push(precision);
      results.recall.push(recall);
      results.f1.push(f1);
    }

    // Calculate average metrics
    return {
      avgRMSE: this.average(results.rmse),
      avgMAE: this.average(results.mae),
      avgPrecision: this.average(results.precision),
      avgRecall: this.average(results.recall),
      avgF1: this.average(results.f1),
      stdRMSE: this.standardDeviation(results.rmse),
      stdMAE: this.standardDeviation(results.mae),
      stdPrecision: this.standardDeviation(results.precision),
      stdRecall: this.standardDeviation(results.recall),
      stdF1: this.standardDeviation(results.f1)
    };
  }

  /**
   * A/B TESTING FRAMEWORK
   */
  conductABTest(groupA, groupB, metric = 'precision') {
    const metricsA = this.calculateGroupMetrics(groupA, metric);
    const metricsB = this.calculateGroupMetrics(groupB, metric);

    const meanA = this.average(metricsA);
    const meanB = this.average(metricsB);
    const stdA = this.standardDeviation(metricsA);
    const stdB = this.standardDeviation(metricsB);

    // Perform t-test
    const tScore = this.tTest(metricsA, metricsB);
    const pValue = this.calculatePValue(tScore, metricsA.length + metricsB.length - 2);

    return {
      groupA: { mean: meanA, std: stdA, count: metricsA.length },
      groupB: { mean: meanB, std: stdB, count: metricsB.length },
      difference: meanB - meanA,
      percentageImprovement: meanA !== 0 ? ((meanB - meanA) / meanA) * 100 : 0,
      tScore: tScore,
      pValue: pValue,
      significant: pValue < 0.05,
      confidence: (1 - pValue) * 100
    };
  }

  /**
   * COMPREHENSIVE EVALUATION
   */
  evaluateRecommendationSystem(testData, algorithm, options = {}) {
    const {
      k = 10,
      thresholds = [3.5, 4.0, 4.5],
      calculateDiversity = false,
      calculateNovelty = false
    } = options;

    const results = {};
    const predictions = [];
    const actualRatings = [];
    const allRecommendations = [];

    // Generate predictions and recommendations for each user
    for (const user of testData.users) {
      const userPredictions = algorithm.predict(user.id, user.testItems);
      const userRecommendations = algorithm.getRecommendations(user.id, k);
      
      predictions.push(...userPredictions);
      actualRatings.push(...user.testItems.map(item => item.rating));
      allRecommendations.push(userRecommendations);
    }

    // Calculate accuracy metrics
    results.rmse = this.calculateRMSE(predictions, actualRatings);
    results.mae = this.calculateMAE(predictions, actualRatings);

    // Calculate ranking metrics for each threshold
    results.ranking = {};
    for (const threshold of thresholds) {
      const rankingMetrics = this.calculateRankingMetrics(
        allRecommendations, 
        testData, 
        threshold, 
        k
      );
      results.ranking[threshold] = rankingMetrics;
    }

    // Calculate coverage
    results.coverage = this.calculateCoverage(
      allRecommendations, 
      testData.totalItems
    );

    // Optional: Calculate diversity and novelty
    if (calculateDiversity) {
      results.diversity = this.calculateAverageDiversity(
        allRecommendations, 
        testData.similarityMatrix
      );
    }

    if (calculateNovelty) {
      results.novelty = this.calculateAverageNovelty(
        allRecommendations,
        testData.itemPopularities
      );
    }

    // Store evaluation in history
    this.evaluationHistory.push({
      timestamp: new Date(),
      algorithm: algorithm.name,
      results: results
    });

    return results;
  }

  /**
   * UTILITY METHODS
   */
  average(arr) {
    return arr.length > 0 ? arr.reduce((sum, val) => sum + val, 0) / arr.length : 0;
  }

  standardDeviation(arr) {
    const mean = this.average(arr);
    const squaredDiffs = arr.map(val => Math.pow(val - mean, 2));
    return Math.sqrt(this.average(squaredDiffs));
  }

  calculateExpectedness(item, userProfile) {
    // Simplified expectedness calculation
    // In practice, this would be more sophisticated
    return userProfile.preferences[item] || 0;
  }

  calculateGroupMetrics(group, metric) {
    // Extract metric values from group data
    return group.map(user => user.metrics[metric] || 0);
  }

  calculateRankingMetrics(recommendations, testData, threshold, k) {
    let totalPrecision = 0;
    let totalRecall = 0;
    let totalF1 = 0;
    let totalNDCG = 0;
    let userCount = 0;

    for (let i = 0; i < recommendations.length; i++) {
      const userRecs = recommendations[i];
      const userTest = testData.users[i];
      const relevantItems = userTest.testItems
        .filter(item => item.rating >= threshold)
        .map(item => item.movieId);

      const precision = this.calculatePrecision(userRecs, relevantItems, k);
      const recall = this.calculateRecall(userRecs, relevantItems, k);
      const f1 = this.calculateF1Score(precision, recall);
      
      // Create relevance scores for NDCG
      const relevanceScores = {};
      userTest.testItems.forEach(item => {
        relevanceScores[item.movieId] = item.rating >= threshold ? 1 : 0;
      });
      const ndcg = this.calculateNDCG(userRecs, relevanceScores, k);

      totalPrecision += precision;
      totalRecall += recall;
      totalF1 += f1;
      totalNDCG += ndcg;
      userCount++;
    }

    return {
      precision: userCount > 0 ? totalPrecision / userCount : 0,
      recall: userCount > 0 ? totalRecall / userCount : 0,
      f1Score: userCount > 0 ? totalF1 / userCount : 0,
      ndcg: userCount > 0 ? totalNDCG / userCount : 0
    };
  }

  calculateAverageDiversity(allRecommendations, similarityMatrix) {
    let totalDiversity = 0;
    for (const recommendations of allRecommendations) {
      totalDiversity += this.calculateDiversity(recommendations, similarityMatrix);
    }
    return allRecommendations.length > 0 ? totalDiversity / allRecommendations.length : 0;
  }

  calculateAverageNovelty(allRecommendations, itemPopularities) {
    let totalNovelty = 0;
    for (const recommendations of allRecommendations) {
      totalNovelty += this.calculateNovelty(recommendations, itemPopularities);
    }
    return allRecommendations.length > 0 ? totalNovelty / allRecommendations.length : 0;
  }

  // Statistical test methods
  tTest(sample1, sample2) {
    const mean1 = this.average(sample1);
    const mean2 = this.average(sample2);
    const n1 = sample1.length;
    const n2 = sample2.length;
    
    const variance1 = sample1.reduce((sum, x) => sum + Math.pow(x - mean1, 2), 0) / (n1 - 1);
    const variance2 = sample2.reduce((sum, x) => sum + Math.pow(x - mean2, 2), 0) / (n2 - 1);
    
    const pooledVariance = ((n1 - 1) * variance1 + (n2 - 1) * variance2) / (n1 + n2 - 2);
    const standardError = Math.sqrt(pooledVariance * (1/n1 + 1/n2));
    
    return (mean1 - mean2) / standardError;
  }

  calculatePValue(tScore, degreesOfFreedom) {
    // Simplified p-value calculation
    // In practice, you'd use a proper statistical library
    return Math.min(1, Math.abs(tScore) / 10); // Placeholder
  }
}

export default EvaluationMetrics;
