<!-- ## happy path
* greet
  - utter_greet
* mood_great
  - utter_happy

## sad path 1
* greet
  - utter_greet
* mood_unhappy
  - utter_cheer_up
  - utter_did_that_help
* affirm
  - utter_happy

## sad path 2
* greet
  - utter_greet
* mood_unhappy
  - utter_cheer_up
  - utter_did_that_help
* deny
  - utter_goodbye -->
## start
* get_started
  - utter_greet

## greet path
* greet
  - utter_greet

## say goodbye
* goodbye
  - utter_goodbye

## bot challenge
* bot_challenge
  - utter_iamabot

## happy
* affirm
  - utter_happy

## bad mood
* mood_bad
  - utter_whatswrong
  
## path1
* faq_distancing
  - action_faq_distancing
  - action_get_emotion

## path2
* faq_spread
  - action_faq_spread
  - action_get_emotion

## path3
* faq_symptoms
  - action_faq_symptoms
  - action_get_emotion

## path4
* faq_status
  - action_faq_status
  - action_get_emotion

## path5
* faq_vaccine
  - action_faq_vaccine
  - action_get_emotion

## path6
* faq_flu
  - action_faq_flu
  - action_get_emotion

## path7
* faq_curve
  - action_faq_curve
  - action_get_emotion

## path8
* faq_vulnerable
  - utter_faq_vulnerable
  - action_get_emotion

## path9
* faq_testing
  - utter_faq_testing
  - action_get_emotion

## path10
* faq_supply
  - utter_faq_supply
  - action_get_emotion

## path11
* faq_masks
  - utter_faq_masks
  - action_get_emotion

## path12
* faq_timescale
  - utter_faq_timescale
  - action_get_emotion

## path13
* faq_handwashing
  - utter_faq_handwashing
  - action_get_emotion

## path14
* faq_whatisit
  - utter_faq_whatisit
  - action_get_emotion

## path15
* faq_origin
  - utter_faq_origin
  - action_get_emotion
  
## path16
* out_of_scope
  - custom_fallback_action


## path17
* hcq4
  - utter_hcq4
  - action_get_emotion

## path18
* on_youth4
  - utter_on_youth4
  - utter_helpline
  - action_get_emotion

## path19
* on_mass_gathering
  - utter_on_mass_gathering
  - utter_on_mass_gathering1
  - utter_on_mass_gathering2
  - action_get_emotion

## path20
* on_youth5
  - utter_on_youth5
  - utter_on_youth6
  - action_get_emotion

## path21
* on_healthcareworkers11
  - utter_on_healthcareworkers11
  - utter_helpline
  - action_get_emotion

## path22
* public_advice
  - utter_on_public_advice
  - utter_on_public_advice1
  - action_get_emotion

## path23
* on_youth7
  - utter_on_youth7
  - utter_on_youth71
  - action_get_emotion

## path24
* on_resource
  - utter_on_resources
  - utter_on_resources1
  - utter_on_resources2
  - action_get_emotion

## path25
* on_physical_health
  - utter_on_physical_health1
  - utter_on_physical_health2
  - action_get_emotion

## path26
* on_healthcareworkers16
  - utter_on_healthcareworkers16
  - action_get_emotion

## path27
* on_healthcareworkers15
  - utter_on_healthcareworkers15
  - action_get_emotion

## path28
* on_healthcareworkers14
  - utter_on_healthcareworkers14
  - action_get_emotion

## path29
* on_healthcareworkers9
  - utter_on_healthcareworkers9
  - action_get_emotion

## path30
* on_healthcareworkers5
  - utter_on_healthcareworkers5
  - action_get_emotion

## path31
* on_healthcareworkers4
  - utter_on_healthcareworkers4
  - action_get_emotion

## path32
* on_healthcareworkers1
  - utter_on_healthcareworkers1
  - action_get_emotion

## path33
* on_youth11
  - utter_on_youth11
  - action_get_emotion

## path34
* on_youth19
  - utter_on_youth19
  - action_get_emotion

## path35
* on_youth16
  - utter_on_youth16
  - action_get_emotion

## path36
* on_youth8
  - utter_on_youth8
  - action_get_emotion

## thank
* thank
  - utter_thankful

## finding therapy
* findHelp
  - action_find_help

## mentalHealth treat
* mentalHealth
  - utter_mhtreatment

## quote
* quote
  - utter_cheer_up_quote
  - utter_did_that_help
* deny
  - utter_hereisanother
  - utter_cheer_up_quote
  - utter_did_that_help
* deny
  - utter_hereisanother
  - utter_cheer_up_quote
  - utter_did_that_help
* deny
  - utter_couldnt_help
  - action_find_help

## img
* img
  - utter_cheer_up_img
  - utter_did_that_help
* deny
  - utter_hereisanother
  - utter_cheer_up_img
  - utter_did_that_help
* deny
  - utter_hereisanother
  - utter_cheer_up_img
  - utter_did_that_help
* deny
  - utter_couldnt_help
  - action_find_help

## joke
* joke
  - utter_cheer_up_joke
  - utter_did_that_help
* deny
  - utter_hereisanother
  - utter_cheer_up_joke
  - utter_did_that_help
* deny
  - utter_hereisanother
  - utter_cheer_up_joke
  - utter_did_that_help
* deny
  - utter_couldnt_help
  - action_find_help

## song
* song
  - utter_cheer_up_song
  - utter_did_that_help
* deny
  - utter_hereisanother
  - utter_cheer_up_song
  - utter_did_that_help
* deny
  - utter_hereisanother
  - utter_cheer_up_song
  - utter_did_that_help
* deny
  - utter_couldnt_help
  - action_find_help

## dealing_depression
* depression
  - utter_help_depressed
  - action_help_depression
  - utter_did_that_help
* deny
  - utter_couldnt_help
  - action_find_help
  
## dealing_tragedy
* tragedy
  - utter_help_tragedy
  - utter_did_that_help
* deny
  - utter_couldnt_help
  - action_find_help

## dealing_stress
* stress
  - utter_help_stressed
  - utter_did_that_help
* deny
  - utter_couldnt_help
  - action_find_help

## dealing_suicide
* suicidal
  - utter_suicide_help
  - utter_suicide_help1
  - action_help_suicide
  - utter_did_that_help
* deny
  - utter_couldnt_help
  - action_find_help

## sad path
* mood_unhappy
  - action_help_sad
  - action_listen
  - utter_did_that_help
* deny
  - utter_couldnt_help
  - action_find_help

## negative path
* deny
  - utter_couldnt_help
  - action_find_help

## positive path
* affirm
  - utter_affirm