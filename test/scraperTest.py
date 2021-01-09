import unittest
import scraper

class scraperTest(unittest.TestCase):

    def testFilters(self):
        #defaults are: MAX_PRICE = 2000000, MAX_YEAR = 1991
        car c = new car
        car.year = 1990
        car.price = 50000
        self.assertTrue(CheckIfMatchesFilters(car))

    def testLocalUrl(self):
        self.assertIsNotNone(getData(true))

if __name__ == '__main__':
    unittest.main()