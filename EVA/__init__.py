'''

                            Online Python Compiler.
                Code, Compile, Run and Debug python program online.
Write your code in this editor and press "Run" button to execute it.

'''

num=[1,2,3,4,1,2,3]
d={}
for i in num:
    d[i]=num.count(i)
print(d.items())
print(sorted(d.items(), key= lambda y:y[1]))
