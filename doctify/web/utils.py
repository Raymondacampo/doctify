from .models import Doctor
def compute_is_renderizable(doctor: Doctor) -> bool:
    """
    Returns True if the doctor meets all the required conditions
    and in_person/clinic logic is satisfied. Otherwise returns False.
    """

    # 1. Check if required fields have value
    #    docuser: not None
    #    name, specialities, cities, description: not empty
    #    virtually: we just check it's not None (though BooleanFields always have a value)
    if doctor.docuser:
        required_fields = [
            doctor.docuser,
            doctor.name,
            doctor.specialities,
            doctor.cities,
            doctor.description,
        ]
    else:
        required_fields = [
            doctor.name,
            doctor.specialities,
            doctor.cities,
            doctor.phone_number
        ]
    # If any required field is missing/empty/None => not renderizable
    for field in required_fields:
        if not field:  # This covers None or empty string for name, specialities, etc.
            return False
    if doctor.docuser:
        # 2. If in_person == False => is_renderizable = True
        if not doctor.in_person and doctor.virtually:
            return True

        # 3. If in_person == True => check if clinic has a value
        if doctor.in_person and doctor.clinics:
            return True
    else:
        return True
    # Default case => not renderizable
    return False
