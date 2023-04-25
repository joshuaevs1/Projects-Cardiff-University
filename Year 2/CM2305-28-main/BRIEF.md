Brief:
Your client for this project is a marketing company who would like you to develop software
to analyse where, when and how a given product is mentioned on social media. The
software should in particular enable them to better target their advertising. This could be
accomplished in several ways.

The software should identify geographic areas where the market share of the product is
below average, such that advertising efforts could be focused on these areas. To
implement this feature, you can use the fact that many photos on Flickr and many tweets
are provided with geographical coordinates. These coordinates can be obtained by using
public APIs provided by Flickr and Twitter. By plotting the coordinates of photos or tweets
mentioning the product on a map, useful information about the market share of the product
can be revealed. In particular, given the name of a product and the names of one or more
competitor products, the software should be able to visually display on a map where each
product is most popular.

Tweets mentioning a given product may do so in a positive or in a negative way. Simply
counting the number of tweets mentioning the product in a given geographic area can
therefore only provide a coarse approximation. However, a number of sentiment analysis
tools are now available, which could be used to automatically distinguish tweets which are
positive from tweets which are negative. By incorporating such techniques, more accurate
conclusions can be drawn about where more advertising would be useful.

Finally, the software should be able to build a profile of potential customers, by analysing
the characteristics of users who mention this or related products (e.g. based on features
from their Twitter of Flickr profile such as gender, age or geographic location). The
software should then also be able to discover which are the most popular TV programmes
of potential customers (using Twitter) and which are the places they most like to visit
(using Flickr). In this way, the marketing company can decide during the commercial
breaks of which TV programs to advertise the product, or at which locations to pay for
outdoor advertising.
