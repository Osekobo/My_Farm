from models import db, Sales, Expenses, EmployeeData, Profit

def generate_profit_record(start_date, end_date, include_salaries=True, include_expenses=True):
    total_sales = db.session.query(db.func.sum(Sales.amount))\
        .filter(Sales.date >= start_date, Sales.date <= end_date).scalar() or 0

    total_expenses = 0
    if include_expenses:
        total_expenses = db.session.query(db.func.sum(Expenses.amount))\
            .filter(Expenses.date >= start_date, Expenses.date <= end_date).scalar() or 0

    total_salaries = 0
    if include_salaries:
        total_salaries = db.session.query(db.func.sum(EmployeeData.salary))\
            .filter(EmployeeData.date >= start_date, EmployeeData.date <= end_date).scalar() or 0

    profit_amount = total_sales - (total_expenses + total_salaries)

    profit_record = Profit(
        start_date=start_date,
        end_date=end_date,
        total_sales=total_sales,
        total_expenses=total_expenses,
        total_salaries=total_salaries,
        profit_amount=profit_amount
    )
    db.session.add(profit_record)
    db.session.commit()

    return {
        "id": profit_record.id,
        "start_date": str(profit_record.start_date),
        "end_date": str(profit_record.end_date),
        "total_sales": total_sales,
        "total_expenses": total_expenses,
        "total_salaries": total_salaries,
        "profit_amount": profit_amount
    }
