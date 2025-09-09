/**
 * Sentiment Analysis System for Movie Reviews
 * Analyzes user reviews, comments, and feedback to extract sentiment scores
 */

class SentimentAnalyzer {
  constructor() {
    // Positive sentiment keywords
    this.positiveWords = new Set([
      'amazing', 'awesome', 'excellent', 'fantastic', 'great', 'love', 'wonderful', 
      'brilliant', 'outstanding', 'perfect', 'incredible', 'spectacular', 'superb',
      'marvelous', 'terrific', 'fabulous', 'phenomenal', 'magnificent', 'stunning',
      'breathtaking', 'masterpiece', 'genius', 'epic', 'hilarious', 'entertaining',
      'engaging', 'compelling', 'thrilling', 'exciting', 'beautiful', 'impressive',
      'remarkable', 'exceptional', 'flawless', 'mind-blowing', 'captivating',
      'gripping', 'touching', 'heartwarming', 'inspiring', 'uplifting', 'delightful'
    ]);

    // Negative sentiment keywords
    this.negativeWords = new Set([
      'awful', 'terrible', 'horrible', 'bad', 'worst', 'hate', 'disappointing',
      'boring', 'dull', 'stupid', 'waste', 'pathetic', 'disaster', 'mess',
      'trash', 'garbage', 'rubbish', 'nonsense', 'ridiculous', 'absurd',
      'pointless', 'confusing', 'annoying', 'irritating', 'frustrating',
      'tedious', 'unbearable', 'unwatchable', 'poorly', 'failed', 'lacks',
      'missing', 'weak', 'shallow', 'mediocre', 'overrated', 'cliché',
      'predictable', 'cheap', 'cringe', 'uncomfortable', 'depressing'
    ]);

    // Intensifiers that modify sentiment strength
    this.intensifiers = new Map([
      ['very', 1.5], ['extremely', 2.0], ['incredibly', 1.8], ['absolutely', 1.7],
      ['completely', 1.6], ['totally', 1.5], ['really', 1.3], ['quite', 1.2],
      ['pretty', 1.1], ['rather', 1.1], ['somewhat', 0.8], ['slightly', 0.7]
    ]);

    // Negation words that flip sentiment
    this.negationWords = new Set([
      'not', 'no', 'never', 'nothing', 'nobody', 'nowhere', 'neither', 'nor',
      'none', 'without', 'hardly', 'scarcely', 'barely', 'rarely', 'seldom'
    ]);

    // Emoticons and emojis
    this.emoticons = new Map([
      [':)', 0.5], [':(', -0.5], [':D', 0.8], [':P', 0.3], [':|', 0],
      [':/', -0.2], ['<3', 0.7], ['</3', -0.7], ['😊', 0.6], ['😢', -0.6],
      ['😍', 0.8], ['😤', -0.4], ['👍', 0.5], ['👎', -0.5], ['❤️', 0.7],
      ['💔', -0.7], ['🔥', 0.6], ['💯', 0.7], ['😂', 0.6], ['😭', -0.5]
    ]);
  }

  /**
   * Main sentiment analysis function
   */
  analyzeSentiment(text) {
    if (!text || typeof text !== 'string') {
      return { score: 0, sentiment: 'neutral', confidence: 0, details: {} };
    }

    const cleanText = this.preprocessText(text);
    const words = cleanText.toLowerCase().split(/\s+/);
    
    let positiveScore = 0;
    let negativeScore = 0;
    let neutralScore = 0;
    
    const analysis = {
      positiveWords: [],
      negativeWords: [],
      intensifiers: [],
      negations: [],
      emoticons: []
    };

    // Analyze each word and its context
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const prevWord = i > 0 ? words[i - 1] : '';
      const nextWord = i < words.length - 1 ? words[i + 1] : '';

      // Check for emoticons/emojis
      if (this.emoticons.has(word)) {
        const score = this.emoticons.get(word);
        analysis.emoticons.push({ word, score });
        if (score > 0) positiveScore += Math.abs(score);
        else if (score < 0) negativeScore += Math.abs(score);
        continue;
      }

      // Check for sentiment words
      let wordScore = 0;
      let isPositive = false;
      let isNegative = false;

      if (this.positiveWords.has(word)) {
        wordScore = 1;
        isPositive = true;
        analysis.positiveWords.push(word);
      } else if (this.negativeWords.has(word)) {
        wordScore = 1;
        isNegative = true;
        analysis.negativeWords.push(word);
      }

      if (wordScore > 0) {
        // Apply intensifiers
        let multiplier = 1;
        if (this.intensifiers.has(prevWord)) {
          multiplier = this.intensifiers.get(prevWord);
          analysis.intensifiers.push({ word: prevWord, target: word, multiplier });
        }

        // Apply negation
        let isNegated = false;
        for (let j = Math.max(0, i - 3); j < i; j++) {
          if (this.negationWords.has(words[j])) {
            isNegated = true;
            analysis.negations.push({ negation: words[j], target: word });
            break;
          }
        }

        const finalScore = wordScore * multiplier;
        
        if (isNegated) {
          // Flip sentiment
          if (isPositive) negativeScore += finalScore;
          else if (isNegative) positiveScore += finalScore;
        } else {
          if (isPositive) positiveScore += finalScore;
          else if (isNegative) negativeScore += finalScore;
        }
      }
    }

    // Calculate final sentiment
    const totalScore = positiveScore + negativeScore;
    const normalizedScore = totalScore > 0 ? 
      (positiveScore - negativeScore) / totalScore : 0;

    // Determine sentiment category
    let sentiment = 'neutral';
    let confidence = 0;

    if (normalizedScore > 0.1) {
      sentiment = 'positive';
      confidence = Math.min(normalizedScore, 1);
    } else if (normalizedScore < -0.1) {
      sentiment = 'negative';
      confidence = Math.min(Math.abs(normalizedScore), 1);
    } else {
      sentiment = 'neutral';
      confidence = 1 - Math.abs(normalizedScore);
    }

    return {
      score: normalizedScore,
      sentiment: sentiment,
      confidence: confidence,
      details: {
        positiveScore: positiveScore,
        negativeScore: negativeScore,
        wordCount: words.length,
        analysis: analysis
      }
    };
  }

  /**
   * Batch analyze multiple reviews
   */
  analyzeReviews(reviews) {
    return reviews.map(review => ({
      ...review,
      sentiment: this.analyzeSentiment(review.text || review.comment || review.review)
    }));
  }

  /**
   * Calculate sentiment statistics for a movie
   */
  calculateMovieSentiment(reviews) {
    if (!reviews || reviews.length === 0) {
      return {
        averageSentiment: 0,
        sentimentDistribution: { positive: 0, negative: 0, neutral: 0 },
        confidence: 0,
        totalReviews: 0
      };
    }

    const sentiments = reviews.map(review => 
      this.analyzeSentiment(review.text || review.comment || review.review)
    );

    let totalScore = 0;
    let totalConfidence = 0;
    let positive = 0, negative = 0, neutral = 0;

    for (const sentiment of sentiments) {
      totalScore += sentiment.score;
      totalConfidence += sentiment.confidence;

      switch (sentiment.sentiment) {
        case 'positive': positive++; break;
        case 'negative': negative++; break;
        case 'neutral': neutral++; break;
      }
    }

    const total = sentiments.length;
    return {
      averageSentiment: totalScore / total,
      sentimentDistribution: {
        positive: (positive / total) * 100,
        negative: (negative / total) * 100,
        neutral: (neutral / total) * 100
      },
      confidence: totalConfidence / total,
      totalReviews: total,
      detailedSentiments: sentiments
    };
  }

  /**
   * Sentiment-based rating prediction
   */
  predictRatingFromSentiment(sentimentScore, baseRating = 5) {
    // Convert sentiment score (-1 to 1) to rating adjustment
    const adjustment = sentimentScore * 2.5; // Max adjustment of ±2.5
    const predictedRating = Math.max(1, Math.min(10, baseRating + adjustment));
    return Math.round(predictedRating * 10) / 10; // Round to 1 decimal
  }

  /**
   * Extract sentiment trends over time
   */
  analyzeSentimentTrends(reviewsWithDates) {
    const monthlyData = {};
    
    reviewsWithDates.forEach(review => {
      const date = new Date(review.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = [];
      }
      
      monthlyData[monthKey].push(
        this.analyzeSentiment(review.text || review.comment || review.review)
      );
    });

    const trends = Object.keys(monthlyData)
      .sort()
      .map(month => {
        const sentiments = monthlyData[month];
        const avgScore = sentiments.reduce((sum, s) => sum + s.score, 0) / sentiments.length;
        const avgConfidence = sentiments.reduce((sum, s) => sum + s.confidence, 0) / sentiments.length;
        
        return {
          month,
          averageScore: avgScore,
          confidence: avgConfidence,
          reviewCount: sentiments.length,
          trend: this.determineTrend(avgScore)
        };
      });

    return trends;
  }

  /**
   * Preprocess text for analysis
   */
  preprocessText(text) {
    return text
      .replace(/[^\w\s\.\!\?\:\)\(\<\>\/\-\+\=]/g, ' ') // Keep basic punctuation
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  /**
   * Determine sentiment trend
   */
  determineTrend(score) {
    if (score > 0.2) return 'improving';
    if (score < -0.2) return 'declining';
    return 'stable';
  }

  /**
   * Generate sentiment insights
   */
  generateInsights(movieSentiment) {
    const insights = [];
    const { averageSentiment, sentimentDistribution, confidence, totalReviews } = movieSentiment;

    // Overall sentiment insight
    if (averageSentiment > 0.3) {
      insights.push({
        type: 'positive',
        message: `This movie has overwhelmingly positive reviews with ${sentimentDistribution.positive.toFixed(1)}% positive sentiment.`,
        confidence: confidence
      });
    } else if (averageSentiment < -0.3) {
      insights.push({
        type: 'negative',
        message: `This movie has mostly negative reviews with ${sentimentDistribution.negative.toFixed(1)}% negative sentiment.`,
        confidence: confidence
      });
    } else {
      insights.push({
        type: 'mixed',
        message: `This movie has mixed reviews with balanced sentiment across viewers.`,
        confidence: confidence
      });
    }

    // Review volume insight
    if (totalReviews > 100) {
      insights.push({
        type: 'volume',
        message: `High review volume (${totalReviews} reviews) indicates strong audience engagement.`,
        confidence: 0.9
      });
    }

    // Confidence insight
    if (confidence < 0.6) {
      insights.push({
        type: 'uncertainty',
        message: `Sentiment analysis confidence is moderate. Reviews may contain mixed or ambiguous opinions.`,
        confidence: confidence
      });
    }

    return insights;
  }
}

export default SentimentAnalyzer;
