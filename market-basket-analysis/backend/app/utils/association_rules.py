def filter_rules(rules, min_lift=1.0):
    return rules[rules['lift'] >= min_lift]