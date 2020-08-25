import numpy as np
from scipy.integrate import odeint
import matplotlib.pyplot as plt
from datetime import timedelta,date
import sys
### FUNCTIONS LIVE UP HERE ###

def plot_sir(time_grid, infectious):
    '''
    Plotting function for SIR model
    '''
    fig = plt.figure(facecolor='w')
    ax = fig.add_subplot(111, facecolor="#dddddd", axisbelow=True)
    
    ax.plot(time_grid, infectious, 'r', alpha=0.5, lw=2, label='Infected')

    ax.set_xlabel('day Counts')
    ax.set_ylabel('Number of Infected People')
    ax.yaxis.set_tick_params(length=0)
    ax.xaxis.set_tick_params(length=0)

    ax.grid(b=True, which='major', c='w', lw=2, ls='-')

    legend = ax.legend()
    legend.get_frame().set_alpha(0.5)

    for spine in ('top', 'right', 'bottom', 'left'):
        ax.spines[spine].set_visible(False)
    plt.show()


def get_initial_susceptible(total_population, initial_infected, initial_removed):
    '''
    Everyone not initially_infected is naively
    considered susceptible initially
    '''
    return total_population - initial_infected - initial_removed

def get_beta(recovery_period_in_days):
    '''
    beta is the avg number of contacts per person,
    per day, multiplied by the proba of disease transm
    in a contact between a susceptible preson and 
    an infectious person
    susceptible --> infectious
    '''
    #At the time of coding this program,basic reproduction number for COVID-19 in India.Calculated using I= I(0)*exp[gamma * (R0-1)*t] considering N/S approximately equals 1
    R0 = 1.571869846974838 
    return R0*(1/recovery_period_in_days)  #avg_num_contacts_per_person * proba_of_disease_transm    #R0 * gamma , gamma = 1/recovery_period in days


def get_mean_recov_rate(recovery_period_in_days):
    '''
    mean recovery/mortality rate (gamma), 1 over how many
    days it takes a person to recover
    '''
    return 1.0 / recovery_period_in_days


def deriv_susceptible_wrt_time(beta, susceptible, infectious, total_population):
    '''
    assume that susceptible will always decrease given
    the nature of this disease transm e.g. assumed immunity
    '''
    return -beta * susceptible * (infectious / total_population)


def deriv_infectious_wrt_time(beta, susceptible, infectious, total_population, mean_recov_rate):
    '''
    simply, infectious draws from susceptible, and is depleted by recovery
    '''
    return beta * susceptible * (infectious / total_population) - (mean_recov_rate * infectious)


def deriv_removed_wrt_time(mean_recov_rate, infectious):
    '''
    assume that removed is not again susceptible, draws from infectious
    Challenge: incorporate a rate of becoming susceptible again, or reflect partial immunity
    '''
    return mean_recov_rate * infectious


def derivatives_helper(initial_conditions, time_grid, total_population, beta, mean_recov_rate):
    '''
    facilitates the odeint solver from scipy
    notes: time_grid param is not explicitly use
           initial recov'd value is not explicitly used
           from initial_conditions
    '''
    susceptible, infectious, _ = initial_conditions

    dSdt = deriv_susceptible_wrt_time(beta, susceptible, infectious, total_population)
    dIdt = deriv_infectious_wrt_time(beta, susceptible, infectious, total_population, mean_recov_rate)
    dRdt = deriv_removed_wrt_time(mean_recov_rate, infectious)

    return dSdt, dIdt, dRdt


def model(total_population, days, initial_infected, recovery_period_in_days):
    ### THIS IS OUR PROCEDURE ###
    # simply the total population minus the initial infected and initial removed
    initial_susceptible = get_initial_susceptible(total_population, initial_infected, initial_removed)


    # transm rate from susceptible to infectious
    beta = get_beta(recovery_period_in_days)


    # gamma, mean transmission rate from infectious to removed
    mean_recov_rate = get_mean_recov_rate(recovery_period_in_days)


    # each derivative is a funct of time, so we set up a numpy array for time that we'll use in calc's and plotting
    time_grid = np.linspace(0, days, days)

    # Set initial conditions for our diffEQ solver
    initial_conditions = (initial_susceptible, initial_infected, initial_removed)

    # Integrate the SIR equations over the time grid (in days)
    integrate_functions = odeint(derivatives_helper, initial_conditions, time_grid, args=(total_population, beta, mean_recov_rate))

    # unpack the values iot pass them into a plotting function
    susceptible, infectious, removed = integrate_functions.T
    return susceptible[-1],infectious[-1],removed[-1]
    #plot_sir(time_grid, infectious)


if __name__ == "__main__":
    ### THESE ARE OUR PARAMETERS ###



    # Assume a "closed" population (related to S)
    total_population = 1380004385

    # TODO: add param for population density?

    # Number of days in consideration
    days = (date.today() - date(2020,3,23)).days

    initial_infected = 497 #497 total cases on 23rd march,with 25 recovered,9 dead.So I(0) is assumed as approximately as 497-25-9
    initial_removed = 0

    # parameter to build avg recovery rate (gamma)
    recovery_period_in_days = 10



    # Run the model
    

    predictions = {'date':[],'S':[],'I':[],'R':[]} 
    predictions1 = {} # {I(t) : date}
    predictions2 = {} # {date : I(t)}
    for i in range(0,600):
        S,I,R = model(total_population, days, initial_infected, recovery_period_in_days)
        predictions1[round(I)] = date.today()+timedelta(i)
        predictions2[date.today()+timedelta(i)] = round(I)
        predictions['date'].append(date.today()+timedelta(i))
        predictions['S'].append(round(S))
        predictions['I'].append(round(I))
        predictions['R'].append(round(R))
        days+=1

    # dateInput = date.today()
    dateInput = date(int(sys.argv[1]),int(sys.argv[2]),int(sys.argv[3]))

    if(int(sys.argv[1])>=date.today().year and int(sys.argv[2])>=date.today().month and int(sys.argv[3])>=date.today().day):
        print("Number of infected cases on {} is {}##########".format(dateInput,int(predictions2[dateInput])))
        print('COVID-19 peak in India expected on: {},with: {} million confirmed cases##########'.format(predictions1[round(max(predictions['I']))],max(predictions['I'])/1000000))
        
    else:
        print("Please re-enter a date of the future!##########")
        print('COVID-19 peak in India expected on: {},with: {} million confirmed cases##########'.format(predictions1[round(max(predictions['I']))],max(predictions['I'])/1000000))
        
    # print(predictions1[round(max(predictions['I']))])
    # import pandas as pd
    # df = pd.DataFrame(predictions)
    # df.to_csv('predictions.csv')

    # print('COVID-19 peak in India expected on: {},with: {} million confirmed cases##########'.format(predictions1[round(max(predictions['I']))],max(predictions['I'])/1000000))
    # print("Number of infected cases on {} is {}##########".format(dateInput,int(predictions2[dateInput])))