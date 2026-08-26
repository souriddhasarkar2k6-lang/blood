from tabulate import tabulate
import sqlite3


conn = sqlite3.connect('datas.db')
cursor = conn.cursor()



def create_tables():
    cursor.execute('''CREATE TABLE IF NOT EXISTS data (
                        id INTEGER PRIMARY KEY,
                        name TEXT,
                        blood_type VARCHAR(3),
                        area TEXT)''')

    

def add_people():
    name = input("Enter your name: ")
    blood_type = input("Enter Blood Type: ")
    area = input("Enter area name: ")
    cursor.execute(
        "INSERT INTO data (name, blood_type, area) VALUES (?, ?, ?)", (name, blood_type, area))
    conn.commit()
    print("You are succcesfully registered !")



def view_people():
    cursor.execute("SELECT * FROM data")
    people = cursor.fetchall()
    print(tabulate(people, headers=["ID", "Name", "BloodType", "Area"], tablefmt="grid"))



def update_address():
    per_id = int(input("Enter ID to update: "))
    new_area = input("Enter new address: ")
    cursor.execute("UPDATE data SET area = ? WHERE id = ?",(new_area, per_id))
    conn.commit()
    print("address updated successfully!")




def delete_people():
    per_id = int(input("Enter ID to delete: "))
    cursor.execute("DELETE FROM data WHERE id = ?", (per_id,))
    conn.commit()
    print("registration deleted successfully!")


def search_donor():
    type = input("Enter Blood Type: ")
    cursor.execute("SELECT * FROM data WHERE blood_type = ?", (type,))
    people = cursor.fetchall()
    print(tabulate(people, headers=["ID", "Name", "BloodType", "Area"], tablefmt="grid"))


def main_menu():
    while True:
        print("1. Access Registry")
        print("2. Search Donors")
        print("3. Exit")
        a = int(input("Enter your choice: "))
        if a == 1:

            print("\n--- Blood Donation Registry ---")
            print("1. Register")
            print("2. View Donors")
            print("3. Update Registration")
            print("4. Delete Registration")
            print("5. Exit")

            choice = input("Enter your choice: ")

            if choice == '1':
                add_people()
            elif choice == '2':
                view_people()
            elif choice == '3':
                update_address()
            elif choice == '4':
                delete_people()
            elif choice == '5':
                print("Exiting... Exited")
                break
            else:
                print("Invalid choice. Please try again.")
        elif a == 2:
            search_donor()
        elif a == 3:
            break



create_tables()
main_menu()
conn.close()
