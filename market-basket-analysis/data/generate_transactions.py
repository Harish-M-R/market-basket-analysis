#!/usr/bin/env python3
"""
Transaction Dataset Generator for Market Basket Analysis
Generates realistic supermarket transaction data with correlated items
"""

import random
import csv

# Product catalog with categories
PRODUCTS = {
    'Dairy': ['Milk', 'Cheese', 'Butter', 'Yogurt', 'Cream'],
    'Bakery': ['Bread', 'Croissants', 'Bagels', 'Muffins', 'Donuts'],
    'Beverages': ['Coffee', 'Tea', 'Juice', 'Soda', 'Water'],
    'Snacks': ['Chips', 'Cookies', 'Crackers', 'Nuts', 'Chocolate'],
    'Produce': ['Apples', 'Bananas', 'Oranges', 'Tomatoes', 'Lettuce'],
    'Meat': ['Chicken', 'Beef', 'Pork', 'Fish', 'Turkey'],
    'Frozen': ['Ice_Cream', 'Frozen_Pizza', 'Frozen_Vegetables', 'Frozen_Dinners'],
    'Household': ['Detergent', 'Paper_Towels', 'Trash_Bags', 'Dish_Soap'],
    'Personal_Care': ['Shampoo', 'Toothpaste', 'Soap', 'Deodorant']
}

# Association patterns (items frequently bought together)
ASSOCIATIONS = [
    ['Bread', 'Butter', 'Milk'],
    ['Coffee', 'Cream', 'Sugar'],
    ['Chips', 'Soda', 'Dip'],
    ['Pasta', 'Tomato_Sauce', 'Cheese'],
    ['Chicken', 'Rice', 'Vegetables'],
    ['Beer', 'Chips', 'Salsa'],
    ['Ice_Cream', 'Chocolate_Syrup', 'Whipped_Cream'],
    ['Bread', 'Peanut_Butter', 'Jelly'],
    ['Cereal', 'Milk', 'Bananas'],
    ['Hamburger_Buns', 'Beef', 'Lettuce', 'Tomatoes']
]

def generate_transaction(transaction_id):
    """Generate a single transaction with realistic item combinations"""
    items = []
    
    # 30% chance to include a correlated itemset
    if random.random() < 0.3 and ASSOCIATIONS:
        association = random.choice(ASSOCIATIONS)
        # Include 60-100% of the associated items
        num_items = max(2, int(len(association) * random.uniform(0.6, 1.0)))
        items.extend(random.sample(association, num_items))
    
    # Add 2-8 random items from different categories
    num_random_items = random.randint(2, 8)
    for _ in range(num_random_items):
        category = random.choice(list(PRODUCTS.keys()))
        item = random.choice(PRODUCTS[category])
        if item not in items:  # Avoid duplicates
            items.append(item)
    
    return f"T{transaction_id:06d}", items

def generate_dataset(num_transactions=1000, output_file='transactions.txt'):
    """Generate complete transaction dataset"""
    print(f"Generating {num_transactions} transactions...")
    
    with open(output_file, 'w') as f:
        for i in range(1, num_transactions + 1):
            tid, items = generate_transaction(i)
            # Format: TransactionID Item1,Item2,Item3,...
            f.write(f"{tid} {','.join(items)}\n")
    
    print(f"Dataset generated: {output_file}")
    print(f"Total transactions: {num_transactions}")

def generate_csv_dataset(num_transactions=1000, output_file='transactions.csv'):
    """Generate dataset in CSV format"""
    print(f"Generating {num_transactions} transactions in CSV format...")
    
    with open(output_file, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['TransactionID', 'Items'])
        
        for i in range(1, num_transactions + 1):
            tid, items = generate_transaction(i)
            writer.writerow([tid, ','.join(items)])
    
    print(f"CSV dataset generated: {output_file}")

if __name__ == '__main__':
    # Generate text format (for Hadoop)
    generate_dataset(num_transactions=5000, output_file='transactions.txt')
    
    # Generate CSV format (for analysis/visualization)
    generate_csv_dataset(num_transactions=5000, output_file='transactions.csv')
    
    print("\nSample transactions:")
    with open('transactions.txt', 'r') as f:
        for i, line in enumerate(f):
            if i < 5:
                print(f"  {line.strip()}")
            else:
                break
